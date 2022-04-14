import GameController from '../controllers/GameController.js';
import {Router} from 'express';
/* eslint-disable new-cap */
const router = Router();
const gameController = new GameController();
/* eslint-enable new-cap */

module.exports = (app) => {

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
