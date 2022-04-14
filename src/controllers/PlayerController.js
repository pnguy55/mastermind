import verify from '../helpers/verifyMandatoryFieldsDefined';
import verifyInteger from '../helpers/verifyInteger';
import PlayerDao from '../data/PlayerDao';

export default class PlayerController {
	constructor() {
		this.playerDao = new PlayerDao();
	}

	async create(req, res) {
		const { body } = req;
		let { name } = body;
		// Validate request
		try {
			verify(
				body, 
				[
					'name',
				]
			);
		} catch(err) {
			res.status(400).send({
				message: err.message,
			});
			return;
		}
		
		const playerCreateInfo = {
			name: name, // string
		}

		// access dao to create player
		try {
			const playerCreateMessage = await this.playerDao.create(playerCreateInfo)
				
			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify(playerCreateMessage, null, 2));
		} catch(err) {
			res.status(500).send({
        message: err.message,
      });
		}
	}

	async search(req, res) {

		const { query } = req;
		let { limit, offset, isHistorical, playerName, gameId} = query;
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
			if(gameId !== undefined) {
				gameId = parseInt(gameId);
				verifyInteger(gameId, 'gameId');
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

		const playerSearchCriteria = {
      gameId: gameId, // integer, exact match
			playerName: playerName, // string, exact match
		}

		try {
			const playerSearchResults = await this.playerDao.search(playerSearchCriteria, limit, offset, isHistorical);
			
			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify(playerSearchResults, null, 2));
		} catch(err) {
			res.status(500).send({
				message:
					err.message,
			});
		}
	}

	async fetch(req, res) {
		const { params } = req;

		let playerId;
		// Validate request
		try {
			verify(params, ['id']);
			playerId = parseInt(params.id.replace(':',''));
			verifyInteger(playerId);
		} catch(err) {
			res.status(400).send({
				message: err.message,
			});
			return;
		}
		// fetch player
		try {
			const playerFetchResult = await this.playerDao.fetch(playerId);
			if(playerFetchResult !== undefined) {			
				res.setHeader('Content-Type', 'application/json');
				res.send(JSON.stringify(playerFetchResult, null, 2));
			}
		} catch(err){
			res.status(404).send({
				message: err.message,
			});
		}
	}

	async update(req, res) {
		const { body, params } = req;
		let { name, score, turnNumber } = body;

		// Validate request
		let playerId;
		try {
			verify(params, ['id']);			
			playerId = parseInt(params.id.replace(':',''));
			verifyInteger(playerId);

			if(score !== undefined) {
				score = parseInt(score);
				verifyInteger(score, 'score');
			}
			if(turnNumber !== undefined) {
				turnNumber = parseInt(turnNumber);
				verifyInteger(turnNumber, 'turnNumber');
			}
		} catch(err) {
			res.status(400).send({
				message: err.message,
			});
			return;
		}

		const playerUpdateInfo = {
			name: name,
			score: score,
			turnNumber: turnNumber,
		}

		try {
			// Returns number of players updated.
			const playerUpdateResult = await this.playerDao.update(playerId,	playerUpdateInfo);

			if (playerUpdateResult !== undefined) {			
				res.setHeader('Content-Type', 'application/json');
				res.send(JSON.stringify(playerUpdateResult, null, 2));
			}
		} catch(err) {
			res.status(500).send({
				message: err.message,
			});
		}
	}

	async delete(req, res) {
		const { params } = req;

		let playerId;
		// Validate request
		try {
			verify(params, ['id']);
			playerId = parseInt(params.id.replace(':',''));
			verifyInteger(playerId);
		} catch(err) {
			res.status(400).send({
				message: err.message,
			});
			return;
		}

		try {
			await this.playerDao.delete(playerId);
			res.send({
				message: 'Player was deleted successfully!',
			});
		} catch(err){
			res.status(500).send({
				message: err.message,
			});
		}
	}

	async deleteAll(req, res) {
		try {
			const playerDeleteAllResult = await this.playerDao.deleteAll();
			res.send({
				message: 'Players were all deleted successfully!',
			});
		} catch(err){
			res.status(500).send({
				message: err.message,
			});
		}
	}
}
