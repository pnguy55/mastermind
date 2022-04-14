import verify from '../helpers/verifyMandatoryFieldsDefined';
import verifyInteger from '../helpers/verifyInteger';
import GameDao from '../data/GameDao';

export default class GameController {
	constructor() {
		this.gameDao = new GameDao();
	}

	async create(req, res) {
		const { body } = req;
		let { playerCount} = body;
		// Validate request
		try {
			verify(
				body, 
				[
					'playerCount', 
				]
			);
			playerCount = parseInt(playerCount);
			verifyInteger(playerCount);
		} catch(err) {
			res.status(400).send({
				message: err.message,
			});
			return;
		}
		
		const gameCreateInfo = {
			playerCount: playerCount, // integer
		}

		// access dao to create game
		try {
			const gameCreateMessage = await this.gameDao.create(gameCreateInfo)
				
			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify(gameCreateMessage, null, 2));
		} catch(err) {
			res.status(500).send({
        message: err.message,
      });
		}
	}

	async search(req, res) {

		const { query } = req;
		let { limit, offset, isHistorical, winnerName, playerName } = query;
		// validate params
		try {
			if(limit !== undefined) {
				limit = parseInt(limit);
				verifyInteger(limit, 'limit');
			}
			if(offset !== undefined) {
				offset = parseInt(offset);
				verifyInteger(offset, 'offset');
			}
			if(isHistorical === undefined) {
				isHistorical = false;
			} else {
				isHistorical = JSON.parse(isHistorical.toLowerCase()) ? true : false;	
			}
		} catch(err) {
			res.status(400).send({
				message: err.message,
			});
			return;
		}

		const gameSearchCriteria = {
			winnerName: winnerName, // string, exact match
			playerName: playerName, // string, exact match
		}

		try {
			const gameSearchResults = await this.gameDao.search(gameSearchCriteria, limit, offset, isHistorical);
			
			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify(gameSearchResults, null, 2));
		} catch(err) {
			res.status(500).send({
				message:
					err.message,
			});
		}
	}

	async fetch(req, res) {
		const { params } = req;

		let gameId;
		// Validate request
		try {
			verify(params, ['id']);
			gameId = parseInt(params.id.replace(':',''));
			verifyInteger(gameId);
		} catch(err) {
			res.status(400).send({
				message: err.message,
			});
			return;
		}
		// fetch game
		try {
			const gameFetchResult = await this.gameDao.fetch(gameId);
			if(gameFetchResult !== undefined) {			
				res.setHeader('Content-Type', 'application/json');
				res.send(JSON.stringify(gameFetchResult, null, 2));
			}
		} catch(err){
			res.status(404).send({
				message: err.message,
			});
		}
	}

	async update(req, res) {
		const { body, params } = req;
		let { turnCount, currentTurn, winner } = body;

		// Validate request
		let gameId;
		try {
			verify(params, ['id']);			
			gameId = parseInt(params.id.replace(':',''));
			verifyInteger(gameId);

			if(turnCount !== undefined) {
				turnCount = parseInt(turnCount);
				verifyInteger(turnCount, 'turnCount');
			}
			if(currentTurn !== undefined) {
				currentTurn = parseInt(currentTurn);
				verifyInteger(currentTurn, 'currentTurn');
			}
			if(winner !== undefined) {
				winner = parseInt(winner);
				verifyInteger(winner, 'winner');
			}
		} catch(err) {
			res.status(400).send({
				message: err.message,
			});
			return;
		}

		const gameUpdateInfo = {
			turnCount: turnCount,
			currentTurn: currentTurn,
			winner: winner,
		}

		try {
			// Returns number of games updated.
			const gameUpdateResult = await this.gameDao.update(gameId,	gameUpdateInfo);

			if (gameUpdateResult !== undefined) {			
				res.setHeader('Content-Type', 'application/json');
				res.send(JSON.stringify(gameUpdateResult, null, 2));
			}
		} catch(err) {
			res.status(500).send({
				message: err.message,
			});
		}
	}
	
	async delete(req, res) {
		const { params } = req;

		let gameId;
		// Validate request
		try {
			verify(params, ['id']);
			gameId = parseInt(params.id.replace(':',''));
			verifyInteger(gameId);
		} catch(err) {
			res.status(400).send({
				message: err.message,
			});
			return;
		}

		try {
			const gameDeleteResult = await this.gameDao.delete(gameId);
			res.send({
				message: 'Game was deleted successfully!',
			});
		} catch(err){
			res.status(500).send({
				message: err.message,
			});
		}
	}

	async deleteAll(req, res) {
		try {
			const gameDeleteAllResult = await this.gameDao.deleteAll();
			res.send({
				message: 'Games were all deleted successfully!',
			});
		} catch(err){
			res.status(500).send({
				message: err.message,
			});
		}
	}
}
