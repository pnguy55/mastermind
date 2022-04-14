'use strict';

var _GameController = require('../controllers/GameController.js');

var _GameController2 = _interopRequireDefault(_GameController);

var _express = require('express');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable new-cap */
const router = (0, _express.Router)();
const gameController = new _GameController2.default();
/* eslint-enable new-cap */

module.exports = app => {

	// Create a new game
	router.post('/', gameController.create.bind(gameController));
	// Retrieve all games
	router.get('/', gameController.search.bind(gameController));
	// Retrieve a single game with id
	router.get('/:id', gameController.fetch.bind(gameController));
	// // Update a game with id
	router.put('/:id', gameController.update.bind(gameController));
	// // Delete a game with id
	router.delete('/:id', gameController.delete.bind(gameController));
	// // Delete all games
	router.delete('/', gameController.deleteAll.bind(gameController));
	app.use('/api/game', router);
};
//# sourceMappingURL=gameRoutes.js.map