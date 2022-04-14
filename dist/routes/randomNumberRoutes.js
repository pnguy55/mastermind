'use strict';

var _RandomNumberController = require('../controllers/RandomNumberController.js');

var _RandomNumberController2 = _interopRequireDefault(_RandomNumberController);

var _express = require('express');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable new-cap */
const router = (0, _express.Router)();
const randomNumberController = new _RandomNumberController2.default();
/* eslint-enable new-cap */

module.exports = app => {

	// Retrieve a random number combination
	router.get('/', randomNumberController.fetch.bind(randomNumberController));
	app.use('/api/randomNumber', router);
};
//# sourceMappingURL=randomNumberRoutes.js.map