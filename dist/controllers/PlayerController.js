'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _verifyMandatoryFieldsDefined = require('../helpers/verifyMandatoryFieldsDefined');

var _verifyMandatoryFieldsDefined2 = _interopRequireDefault(_verifyMandatoryFieldsDefined);

var _verifyInteger = require('../helpers/verifyInteger');

var _verifyInteger2 = _interopRequireDefault(_verifyInteger);

var _PlayerDao = require('../data/PlayerDao');

var _PlayerDao2 = _interopRequireDefault(_PlayerDao);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class PlayerController {
	constructor() {
		this.playerDao = new _PlayerDao2.default();
	}

	async create(req, res) {
		const { body } = req;
		let { name } = body;
		// Validate request
		try {
			(0, _verifyMandatoryFieldsDefined2.default)(body, ['name']);
		} catch (err) {
			res.status(400).send({
				message: err.message
			});
			return;
		}

		const playerCreateInfo = {
			name: name // string


			// access dao to create player
		};try {
			const playerCreateMessage = await this.playerDao.create(playerCreateInfo);

			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify(playerCreateMessage, null, 2));
		} catch (err) {
			res.status(500).send({
				message: err.message
			});
		}
	}

	async search(req, res) {

		const { query } = req;
		let { limit, offset, isHistorical, playerName, gameId } = query;
		// validate params
		try {
			if (limit !== undefined) {
				limit = parseInt(limit);
				(0, _verifyInteger2.default)(limit, 'limit');
			}
			if (offset !== undefined) {
				offset = parseInt(offset);
				(0, _verifyInteger2.default)(offset, 'offset');
			}
			if (gameId !== undefined) {
				gameId = parseInt(gameId);
				(0, _verifyInteger2.default)(gameId, 'gameId');
			}
			if (isHistorical === undefined) {
				isHistorical = false;
			} else {
				isHistorical = JSON.parse(isHistorical.toLowerCase()) ? true : false;
			}
		} catch (err) {
			res.status(400).send({
				message: err.message
			});
			return;
		}

		const playerSearchCriteria = {
			gameId: gameId, // integer, exact match
			playerName: playerName // string, exact match
		};

		try {
			const playerSearchResults = await this.playerDao.search(playerSearchCriteria, limit, offset, isHistorical);

			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify(playerSearchResults, null, 2));
		} catch (err) {
			res.status(500).send({
				message: err.message
			});
		}
	}

	async fetch(req, res) {
		const { params } = req;

		let playerId;
		// Validate request
		try {
			(0, _verifyMandatoryFieldsDefined2.default)(params, ['id']);
			playerId = parseInt(params.id.replace(':', ''));
			(0, _verifyInteger2.default)(playerId);
		} catch (err) {
			res.status(400).send({
				message: err.message
			});
			return;
		}
		// fetch player
		try {
			const playerFetchResult = await this.playerDao.fetch(playerId);
			if (playerFetchResult !== undefined) {
				res.setHeader('Content-Type', 'application/json');
				res.send(JSON.stringify(playerFetchResult, null, 2));
			}
		} catch (err) {
			res.status(404).send({
				message: err.message
			});
		}
	}

	async update(req, res) {
		const { body, params } = req;
		let { name, score, turnNumber } = body;

		// Validate request
		let playerId;
		try {
			(0, _verifyMandatoryFieldsDefined2.default)(params, ['id']);
			playerId = parseInt(params.id.replace(':', ''));
			(0, _verifyInteger2.default)(playerId);

			if (score !== undefined) {
				score = parseInt(score);
				(0, _verifyInteger2.default)(score, 'score');
			}
			if (turnNumber !== undefined) {
				turnNumber = parseInt(turnNumber);
				(0, _verifyInteger2.default)(turnNumber, 'turnNumber');
			}
		} catch (err) {
			res.status(400).send({
				message: err.message
			});
			return;
		}

		const playerUpdateInfo = {
			name: name,
			score: score,
			turnNumber: turnNumber
		};

		try {
			// Returns number of players updated.
			const playerUpdateResult = await this.playerDao.update(playerId, playerUpdateInfo);

			if (playerUpdateResult !== undefined) {
				res.setHeader('Content-Type', 'application/json');
				res.send(JSON.stringify(playerUpdateResult, null, 2));
			}
		} catch (err) {
			res.status(500).send({
				message: err.message
			});
		}
	}

	async delete(req, res) {
		const { params } = req;

		let playerId;
		// Validate request
		try {
			(0, _verifyMandatoryFieldsDefined2.default)(params, ['id']);
			playerId = parseInt(params.id.replace(':', ''));
			(0, _verifyInteger2.default)(playerId);
		} catch (err) {
			res.status(400).send({
				message: err.message
			});
			return;
		}

		try {
			await this.playerDao.delete(playerId);
			res.send({
				message: 'Player was deleted successfully!'
			});
		} catch (err) {
			res.status(500).send({
				message: err.message
			});
		}
	}

	async deleteAll(req, res) {
		try {
			const playerDeleteAllResult = await this.playerDao.deleteAll();
			res.send({
				message: 'Players were all deleted successfully!'
			});
		} catch (err) {
			res.status(500).send({
				message: err.message
			});
		}
	}
}
exports.default = PlayerController;
//# sourceMappingURL=PlayerController.js.map