'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _verifyMandatoryFieldsDefined = require('../helpers/verifyMandatoryFieldsDefined');

var _verifyMandatoryFieldsDefined2 = _interopRequireDefault(_verifyMandatoryFieldsDefined);

var _verifyInteger = require('../helpers/verifyInteger');

var _verifyInteger2 = _interopRequireDefault(_verifyInteger);

var _GameDao = require('../data/GameDao');

var _GameDao2 = _interopRequireDefault(_GameDao);

var _PlayerDao = require('../data/PlayerDao');

var _PlayerDao2 = _interopRequireDefault(_PlayerDao);

var _GuessDao = require('../data/GuessDao');

var _GuessDao2 = _interopRequireDefault(_GuessDao);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class RandomNumberController {
	constructor() {
		this.gameDao = new _GameDao2.default();
		this.guessDao = new _GuessDao2.default();
		this.playerDao = new _PlayerDao2.default();
	}

	async home(req, res) {

		// fetch game interface
		try {

			const game = await this.gameDao.search({});
			const activeGame = game.length > 0;

			if (activeGame) {
				res.redirect(`/:${game[0].gameId}`);
			} else {
				res.render('index', { title: 'Hey', message: 'No game!' });
				// show list of high scores - check history of players with create new game button on top
				// input player names by separated by a new line
				// create new game - post /api/game
				// use return from create to
				// redirect to /:id (gameId)
			}
		} catch (err) {
			res.render('error', { title: 'Hey', message: err.message });
		}
	}

	async startGame(req, res) {
		const { body } = req;

		const game = await this.gameDao.search({});
		const activeGame = game.length > 0;

		if (activeGame) {
			res.redirect(`/restart`);
		}

		let { player1, player2, player3, player4 } = body;

		// Validate request
		try {
			if (player1 === '' && player2 === '' && player3 === '' && player4 === '') throw new Error('Please input at least one player!');
		} catch (err) {
			res.render('index', { title: 'Hey', message: err.message });
			return;
		}

		const players = [];
		if (player1 !== '') players.push(player1);
		if (player2 !== '') players.push(player2);
		if (player3 !== '') players.push(player3);
		if (player4 !== '') players.push(player4);

		let playerCount = players.length;
		let playerCreatesCount = playerCount;
		const playerCreateInfos = [];

		while (playerCreatesCount > 0) {
			playerCreateInfos.push({
				name: players.shift()
			});
			playerCreatesCount--;
		}

		const gameCreateInfo = {
			playerCount: playerCount // integer


			// access dao to create game
		};try {
			const gameCreateMessage = await this.gameDao.create(gameCreateInfo);

			for (const playerCreateInfo of playerCreateInfos) {
				await this.playerDao.create(playerCreateInfo);
			}
			res.redirect(`/:${gameCreateMessage.gameId}`);
		} catch (err) {
			res.render('error', { title: 'Hey', message: err.message });
		}
	}

	async gameRoom(req, res) {
		const { params, query } = req;

		let error;
		if (query.error) {
			error = query.error;
		}

		let gameId;
		// Validate request
		try {
			(0, _verifyMandatoryFieldsDefined2.default)(params, ['id']);
			gameId = parseInt(params.id.replace(':', ''));
			(0, _verifyInteger2.default)(gameId);
		} catch (err) {
			res.render('error', { title: 'Hey', message: err.message });
			return;
		}

		const gameMessage = await this.gameDao.fetchActiveWithPlayersAndGuesses();
		const game = gameMessage[0];

		const { players } = game;

		const emoji = String.fromCodePoint(0x1F648);
		const combination = `${emoji} | ${emoji} | ${emoji} | ${emoji}`;

		if (game.winner) {
			combination = game.combination;
		}

		let guessesByPlayer = {};
		players.forEach(({ name, guesses }) => {
			guessesByPlayer[name] = guesses.map(({ guess, feedback }) => {
				return { guess, feedback };
			});
		});

		const gameRoomMessage = {
			page: 'Game Room',
			combination: combination,
			error: error || ``,
			guessesRemaining: `${10 - game.turnCount}`,
			players: players.map(({ name, score }) => {
				return { name, score };
			}),
			guesses: guessesByPlayer,
			buttonMessage: players.length > 1 ? 'guesses' : 'guess'
		};

		res.render('gameRoom', gameRoomMessage);
	}

	async playRound(req, res) {
		const { body } = req;

		const guessCreateInfos = [];
		let gameId;
		try {
			let players = Object.keys(body);

			let playerInfos = await this.playerDao.search({});
			gameId = playerInfos[0].gameId;
			let count = 0;
			for (const player of players) {
				const currentGuess = body[player].replace(/\ /g, '').replace(/\|/g, '');

				if (currentGuess === '') throw new Error('Everyone must make a guess!');
				if (currentGuess.length !== 4) throw new Error('Guess must be 4 digits long, or separated by pipes -> |');

				for (const num of currentGuess) {
					if (isNaN(num)) {
						throw new Error('Your guess must contain only digits.');
					}
					let numAsInt = parseInt(num);
					if (numAsInt < 0 || numAsInt > 7) {
						throw new Error('Each number of your guess must be between 0 and 7 (Inclusively)');
					}
				}

				const guessCreateObject = {
					playerId: playerInfos[count++].playerId,
					guess: body[player]
				};

				guessCreateInfos.push(guessCreateObject);
			}
		} catch (err) {
			res.redirect(`/:${gameId}?error=${err.message}`);
			return;
		}

		// access dao to create game
		try {

			for (const guessCreateInfo of guessCreateInfos) {
				await this.guessDao.create(guessCreateInfo);
			}

			const currentGame = await this.gameDao.search({}, 2, 0, false, true);
			if (currentGame[0].winner) {
				res.redirect(`/congratulations/:${currentGame[0].winner}`);
				return;
			}

			res.redirect(`/:${gameId}`);
		} catch (err) {
			res.redirect(`/:${gameId}?${err}`);
		}
	}

	async congratulations(req, res) {
		const { params, query } = req;

		let winner;
		// Validate request
		try {
			(0, _verifyMandatoryFieldsDefined2.default)(params, ['winner']);
			winner = params.winner.replace(':', '').replace('%20', ' ');
		} catch (err) {
			res.render('error', { title: 'Hey', message: err.message });
			return;
		}

		res.render('congratulations', {
			winner
		});
	}

	async restart(req, res) {

		try {
			await this.gameDao.deleteAll();

			res.render('index', { title: 'Hey', message: 'No game!' });
		} catch (err) {
			res.render('error', { title: 'Hey', message: err.message });
			return;
		}
	}
}
exports.default = RandomNumberController;
//# sourceMappingURL=AppController.js.map