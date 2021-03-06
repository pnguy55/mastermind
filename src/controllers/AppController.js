import verify from '../helpers/verifyMandatoryFieldsDefined';
import verifyInteger from '../helpers/verifyInteger';
import GameDao from '../data/GameDao';
import PlayerDao from '../data/PlayerDao';
import GuessDao from '../data/GuessDao';

export default class RandomNumberController {
	constructor() {
    this.gameDao = new GameDao();
		this.guessDao = new GuessDao();
		this.playerDao = new PlayerDao();
	}

	async home(req, res) {

		// fetch game interface
		try {

      const game = await this.gameDao.search({});
      const activeGame = game.length > 0;

      if(activeGame) {
				res.redirect(`/:${game[0].gameId}`);
      }
      else {
        res.render('index', { title: 'Hey', message: 'No game!' })
				// show list of high scores - check history of players with create new game button on top
				// input player names by separated by a new line
				// create new game - post /api/game
				// use return from create to
				// redirect to /:id (gameId)

      }
		} catch(err){
			res.render('error', { title: 'Hey', message: err.message});
		}
	}

	async startGame(req, res) {
		const { body } = req;


		const game = await this.gameDao.search({});
		const activeGame = game.length > 0;

		if(activeGame) {
			res.redirect(`/restart`);
		}


		let { player1, player2, player3, player4 } = body;

		// Validate request
		try {
			if(player1 === '' && player2 === ''  && player3 === ''  && player4 === '' ) throw new Error('Please input at least one player!' )

		} catch(err) {
			res.render('index', { title: 'Hey', message: err.message })
			return;
		}

		const players = [];
		if(player1 !== '') players.push(player1);
		if(player2 !== '') players.push(player2);
		if(player3 !== '') players.push(player3);
		if(player4 !== '') players.push(player4);

		let playerCount = players.length;
		let playerCreatesCount = playerCount;
		const playerCreateInfos = [];

		while(playerCreatesCount > 0) {
			playerCreateInfos.push({
				name: players.shift(),
			})
			playerCreatesCount--;
		}

		const gameCreateInfo = {
			playerCount: playerCount, // integer
		}

		// access dao to create game
		try {
			const gameCreateMessage = await this.gameDao.create(gameCreateInfo)

			for(const playerCreateInfo of playerCreateInfos) {
				await this.playerDao.create(playerCreateInfo);
			}
			res.redirect(`/:${gameCreateMessage.gameId}`);
		} catch(err) {
			res.render('error', { title: 'Hey', message: err.message});
		}
	}

	async gameRoom(req, res) {
		const { params, query } = req;

		let error;
		if(query.error) {
			error = query.error;
		}

		let gameId;
		// Validate request
		try {
			verify(params, ['id']);
			gameId = parseInt(params.id.replace(':',''));
			verifyInteger(gameId);
		} catch(err) {
			res.render('error', { title: 'Hey', message: err.message});
			return;
		}

		const gameMessage = await this.gameDao.fetchActiveWithPlayersAndGuesses();
		const game = gameMessage[0];

		const { players } = game;
		
		const emoji = String.fromCodePoint(0x1F648);
		const combination = `${emoji} | ${emoji} | ${emoji} | ${emoji}`

		if(game.winner) {
			combination = game.combination;
		}
		
		let guessesByPlayer = {};
		players.forEach(({name, guesses}) => {
			guessesByPlayer[name] = guesses.map(({guess, feedback}) => { return {guess, feedback} } );
		})

		const gameRoomMessage = { 
			page: 'Game Room', 
			combination: combination,
			error: error || ``,
			guessesRemaining: `${10 - game.turnCount}`,
			players: players.map(({name, score}) => { return {name, score}}),
			guesses: guessesByPlayer,
			buttonMessage: players.length > 1 ? 'guesses' : 'guess',
		}

		res.render('gameRoom', gameRoomMessage)

	}

	async playRound(req, res) {
		const { body  } = req;

		const guessCreateInfos = [];
		let gameId;
		try {
			let players = Object.keys(body);

			let playerInfos = await this.playerDao.search({});
			gameId = playerInfos[0].gameId;
			let count = 0;
			for(const player of players) {
				const currentGuess = body[player].replace(/\ /g, '').replace(/\|/g, '');
				
				if(currentGuess === '') throw new Error('Everyone must make a guess!');
				if(currentGuess.length !== 4) throw new Error('Guess must be 4 digits long, or separated by pipes -> |')

				for(const num of currentGuess) {
					if(isNaN(num)) {
						throw new Error('Your guess must contain only digits.');
					}
					let numAsInt = parseInt(num)
					if(numAsInt < 0 || numAsInt > 7) {
						throw new Error('Each number of your guess must be between 0 and 7 (Inclusively)');
					}
				}

				const formattedGuess = currentGuess.split('').join('|');
				const guessCreateInfo = {
					playerId: playerInfos[count++].playerId,
					guess: formattedGuess
				}

				guessCreateInfos.push(guessCreateInfo);
			
			}

		} catch(err) {
			res.redirect(`/:${gameId}?error=${err.message}`);
			return;
		}


		// access dao to create game
		try {

			for(const guessCreateInfo of guessCreateInfos) {
				await this.guessDao.create(guessCreateInfo);
			}

			const currentGame = await this.gameDao.search({}, 1, 0, false, true);
			if(currentGame[0].winner) {
				const {winner, combination} = currentGame[0];
				res.redirect(`/congratulations?winner=${winner}&combination=${combination}`);
				return;
			}

			res.redirect(`/:${gameId}`);
		} catch(err) {
			res.redirect(`/:${gameId}?${err}`);
		}
	}

	async congratulations(req, res) {
		const { query } = req;

		let winner;
		let combination;
		// Validate request
		try {
			verify(query, ['winner', 'combination']);

			winner = query.winner.replace(':','').replace('%20', ' ');
			combination = query.combination.replace(/%7C/g, '|');
		} catch(err) {
			res.render('error', { title: 'Hey', message: err.message});
			return;
		}

		res.render('congratulations', {
			winner,
			combination
		})
	}

	async restart(req, res) {

		try {
			await this.gameDao.deleteAll();
			
			res.render('index', { title: 'Hey', message: 'No game!' })
		} catch(err) {
			res.render('error', { title: 'Hey', message: err.message});
			return;
		}
	}
}