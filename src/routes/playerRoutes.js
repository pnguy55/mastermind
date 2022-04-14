import PlayerController from '../controllers/PlayerController.js';
import {Router} from 'express';
/* eslint-disable new-cap */
const router = Router();
const playerController = new PlayerController();
/* eslint-enable new-cap */

module.exports = (app) => {

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
