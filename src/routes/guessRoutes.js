import GuessController from '../controllers/GuessController.js';
import {Router} from 'express';
/* eslint-disable new-cap */
const router = Router();
const guessController = new GuessController();
/* eslint-enable new-cap */

module.exports = (app) => {

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
