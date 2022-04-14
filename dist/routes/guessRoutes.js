'use strict';

var _GuessController = require('../controllers/GuessController.js');

var _GuessController2 = _interopRequireDefault(_GuessController);

var _express = require('express');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable new-cap */
const router = (0, _express.Router)();
const guessController = new _GuessController2.default();
/* eslint-enable new-cap */

module.exports = app => {

	// Create a new guess
	router.post('/', guessController.create.bind(guessController));
	// Retrieve all guesses
	router.get('/', guessController.search.bind(guessController));
	// Retrieve a single guess with id
	router.get('/:id', guessController.fetch.bind(guessController));
	// // Delete a guess with id
	router.delete('/:id', guessController.delete.bind(guessController));
	// // Delete all guesses
	router.delete('/', guessController.deleteAll.bind(guessController));
	app.use('/api/guess', router);
};
//# sourceMappingURL=guessRoutes.js.map