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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class GameController {
	constructor() {
		this.gameDao = new _GameDao2.default();
	}

	async create(req, res) {
		const { body } = req;
		let { playerCount } = body;
		// Validate request
		try {
			(0, _verifyMandatoryFieldsDefined2.default)(body, ['playerCount']);
			playerCount = parseInt(playerCount);
			(0, _verifyInteger2.default)(playerCount);
		} catch (err) {
			res.status(400).send({
				message: err.message
			});
			return;
		}

		const gameCreateInfo = {
			playerCount: playerCount // integer


			// access dao to create game
		};try {
			const gameCreateMessage = await this.gameDao.create(gameCreateInfo);

			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify(gameCreateMessage, null, 2));
		} catch (err) {
			res.status(500).send({
				message: err.message
			});
		}
	}

	async search(req, res) {

		const { query } = req;
		let { limit, offset, isHistorical, winnerName, playerName } = query;
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

		const gameSearchCriteria = {
			winnerName: winnerName, // string, exact match
			playerName: playerName // string, exact match
		};

		try {
			const gameSearchResults = await this.gameDao.search(gameSearchCriteria, limit, offset, isHistorical);

			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify(gameSearchResults, null, 2));
		} catch (err) {
			res.status(500).send({
				message: err.message
			});
		}
	}

	async fetch(req, res) {
		const { params } = req;

		let gameId;
		// Validate request
		try {
			(0, _verifyMandatoryFieldsDefined2.default)(params, ['id']);
			gameId = parseInt(params.id.replace(':', ''));
			(0, _verifyInteger2.default)(gameId);
		} catch (err) {
			res.status(400).send({
				message: err.message
			});
			return;
		}
		// fetch game
		try {
			const gameFetchResult = await this.gameDao.fetch(gameId);
			if (gameFetchResult !== undefined) {
				res.setHeader('Content-Type', 'application/json');
				res.send(JSON.stringify(gameFetchResult, null, 2));
			}
		} catch (err) {
			res.status(404).send({
				message: err.message
			});
		}
	}

	async update(req, res) {
		const { body, params } = req;
		let { turnCount, currentTurn, winner } = body;

		// Validate request
		let gameId;
		try {
			(0, _verifyMandatoryFieldsDefined2.default)(params, ['id']);
			gameId = parseInt(params.id.replace(':', ''));
			(0, _verifyInteger2.default)(gameId);

			if (turnCount !== undefined) {
				turnCount = parseInt(turnCount);
				(0, _verifyInteger2.default)(turnCount, 'turnCount');
			}
			if (currentTurn !== undefined) {
				currentTurn = parseInt(currentTurn);
				(0, _verifyInteger2.default)(currentTurn, 'currentTurn');
			}
			if (winner !== undefined) {
				winner = parseInt(winner);
				(0, _verifyInteger2.default)(winner, 'winner');
			}
		} catch (err) {
			res.status(400).send({
				message: err.message
			});
			return;
		}

		const gameUpdateInfo = {
			turnCount: turnCount,
			currentTurn: currentTurn,
			winner: winner
		};

		try {
			// Returns number of games updated.
			const gameUpdateResult = await this.gameDao.update(gameId, gameUpdateInfo);

			if (gameUpdateResult !== undefined) {
				res.setHeader('Content-Type', 'application/json');
				res.send(JSON.stringify(gameUpdateResult, null, 2));
			}
		} catch (err) {
			res.status(500).send({
				message: err.message
			});
		}
	}

	async delete(req, res) {
		const { params } = req;

		let gameId;
		// Validate request
		try {
			(0, _verifyMandatoryFieldsDefined2.default)(params, ['id']);
			gameId = parseInt(params.id.replace(':', ''));
			(0, _verifyInteger2.default)(gameId);
		} catch (err) {
			res.status(400).send({
				message: err.message
			});
			return;
		}

		try {
			const gameDeleteResult = await this.gameDao.delete(gameId);
			res.send({
				message: 'Game was deleted successfully!'
			});
		} catch (err) {
			res.status(500).send({
				message: err.message
			});
		}
	}

	async deleteAll(req, res) {
		try {
			const gameDeleteAllResult = await this.gameDao.deleteAll();
			res.send({
				message: 'Games were all deleted successfully!'
			});
		} catch (err) {
			res.status(500).send({
				message: err.message
			});
		}
	}
}
exports.default = GameController;
//# sourceMappingURL=GameController.js.map