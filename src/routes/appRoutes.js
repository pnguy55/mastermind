import AppController from '../controllers/AppController';
import {Router} from 'express';
/* eslint-disable new-cap */
const router = Router();
const appController = new AppController();
/* eslint-enable new-cap */

module.exports = (app) => {

	// Restart game
	router.get('/restart', appController.restart.bind(appController));
	// Congratulations to winner
	router.get('/congratulations/:winner', appController.congratulations.bind(appController));
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
