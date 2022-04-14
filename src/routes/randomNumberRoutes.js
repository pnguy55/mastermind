import RandomNumberController from '../controllers/RandomNumberController.js';
import {Router} from 'express';
/* eslint-disable new-cap */
const router = Router();
const randomNumberController = new RandomNumberController();
/* eslint-enable new-cap */

module.exports = (app) => {

	// Retrieve a random number combination
	router.get('/', randomNumberController.fetch.bind(randomNumberController));
	app.use('/api/randomNumber', router);
};
