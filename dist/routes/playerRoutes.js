'use strict';

var _PlayerController = require('../controllers/PlayerController.js');

var _PlayerController2 = _interopRequireDefault(_PlayerController);

var _express = require('express');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable new-cap */
const router = (0, _express.Router)();
const playerController = new _PlayerController2.default();
/* eslint-enable new-cap */

module.exports = app => {

	// Create a new player
	router.post('/', playerController.create.bind(playerController));
	// Retrieve all players
	router.get('/', playerController.search.bind(playerController));
	// Retrieve a single player with id
	router.get('/:id', playerController.fetch.bind(playerController));
	// // Update a player with id
	router.put('/:id', playerController.update.bind(playerController));
	// // Delete a player with id
	router.delete('/:id', playerController.delete.bind(playerController));
	// // Delete all players
	router.delete('/', playerController.deleteAll.bind(playerController));
	app.use('/api/player', router);
};
//# sourceMappingURL=playerRoutes.js.map