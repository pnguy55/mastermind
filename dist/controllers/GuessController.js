'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _verifyMandatoryFieldsDefined = require('../helpers/verifyMandatoryFieldsDefined');

var _verifyMandatoryFieldsDefined2 = _interopRequireDefault(_verifyMandatoryFieldsDefined);

var _verifyInteger = require('../helpers/verifyInteger');

var _verifyInteger2 = _interopRequireDefault(_verifyInteger);

var _GuessDao = require('../data/GuessDao');

var _GuessDao2 = _interopRequireDefault(_GuessDao);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class GuessController {
	constructor() {
		this.guessDao = new _GuessDao2.default();
	}

	async create(req, res) {
		const { body } = req;
		let { playerId, guess } = body;
		// Validate request
		try {
			(0, _verifyMandatoryFieldsDefined2.default)(body, ['playerId', 'guess']);
			playerId = parseInt(playerId);
			(0, _verifyInteger2.default)(playerId);
		} catch (err) {
			res.status(400).send({
				message: err.message
			});
			return;
		}

		const guessCreateInfo = {
			playerId: playerId, // integer
			guess: guess // string


			// access dao to create guess
		};try {
			const guessCreateMessage = await this.guessDao.create(guessCreateInfo);

			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify(guessCreateMessage, null, 2));
		} catch (err) {
			res.status(500).send({
				message: err.message
			});
		}
	}

	async search(req, res) {

		const { query } = req;
		let { limit, offset, isHistorical, playerName } = query;
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

		const guessSearchCriteria = {
			playerName: playerName // string, exact match
		};

		try {
			const guessSearchResults = await this.guessDao.search(guessSearchCriteria, limit, offset, isHistorical);

			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify(guessSearchResults, null, 2));
		} catch (err) {
			res.status(500).send({
				message: err.message
			});
		}
	}

	async fetch(req, res) {
		const { params } = req;

		let guessId;
		// Validate request
		try {
			(0, _verifyMandatoryFieldsDefined2.default)(params, ['id']);
			guessId = parseInt(params.id.replace(':', ''));
			(0, _verifyInteger2.default)(guessId);
		} catch (err) {
			res.status(400).send({
				message: err.message
			});
			return;
		}
		// fetch guess
		try {
			const guessFetchResult = await this.guessDao.fetch(guessId);
			if (guessFetchResult !== undefined) {
				res.setHeader('Content-Type', 'application/json');
				res.send(JSON.stringify(guessFetchResult, null, 2));
			}
		} catch (err) {
			res.status(404).send({
				message: err.message
			});
		}
	}

	async delete(req, res) {
		const { params } = req;

		let guessId;
		// Validate request
		try {
			(0, _verifyMandatoryFieldsDefined2.default)(params, ['id']);
			guessId = parseInt(params.id.replace(':', ''));
			(0, _verifyInteger2.default)(guessId);
		} catch (err) {
			res.status(400).send({
				message: err.message
			});
			return;
		}

		try {
			await this.guessDao.delete(guessId);
			res.send({
				message: 'Guess was deleted successfully!'
			});
		} catch (err) {
			res.status(500).send({
				message: err.message
			});
		}
	}

	async deleteAll(req, res) {
		try {
			const guessDeleteAllResult = await this.guessDao.deleteAll();
			res.send({
				message: 'Guesss were all deleted successfully!'
			});
		} catch (err) {
			res.status(500).send({
				message: err.message
			});
		}
	}
}
exports.default = GuessController;
//# sourceMappingURL=GuessController.js.map