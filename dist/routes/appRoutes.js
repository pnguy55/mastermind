'use strict';

var _AppController = require('../controllers/AppController');

var _AppController2 = _interopRequireDefault(_AppController);

var _express = require('express');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable new-cap */
const router = (0, _express.Router)();
const appController = new _AppController2.default();
/* eslint-enable new-cap */

module.exports = app => {

	// Restart game
	router.get('/restart', appController.restart.bind(appController));
	// Congratulations to winner
	router.get('/congratulations', appController.congratulations.bind(appController));
	// Enter home page
	router.get('/', appController.home.bind(appController));
	// Retrieve a single game with id
	router.get('/:id', appController.gameRoom.bind(appController));
	// Start a new game
	router.post('/', appController.startGame.bind(appController));
	// Play a round
	router.post('/play', appController.playRound.bind(appController));

	app.use('/', router);
};
//# sourceMappingURL=appRoutes.js.map