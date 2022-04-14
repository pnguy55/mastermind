'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _verifyMandatoryFieldsDefined = require('../helpers/verifyMandatoryFieldsDefined');

var _verifyMandatoryFieldsDefined2 = _interopRequireDefault(_verifyMandatoryFieldsDefined);

var _verifyInteger = require('../helpers/verifyInteger');

var _verifyInteger2 = _interopRequireDefault(_verifyInteger);

var _RandomNumberDao = require('../data/RandomNumberDao');

var _RandomNumberDao2 = _interopRequireDefault(_RandomNumberDao);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class RandomNumberController {
	constructor() {
		this.randomNumberDao = new _RandomNumberDao2.default();
	}

	async fetch(req, res) {

		// fetch randomNumber combination
		try {
			const randomNumberFetchResult = await this.randomNumberDao.fetch();
			if (randomNumberFetchResult !== undefined) {
				res.setHeader('Content-Type', 'application/json');
				res.send(JSON.stringify(randomNumberFetchResult, null, 2));
			}
		} catch (err) {
			res.status(404).send({
				message: err.message
			});
		}
	}

}
exports.default = RandomNumberController;
//# sourceMappingURL=RandomNumberController.js.map