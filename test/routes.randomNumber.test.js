import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app';
import { sequelize } from '../src/db/sequelize';
import checkStatusCode from './helper/checkStatusCode';

describe('#Suite RandomNumber', () => {

	before(async function() {
		await sequelize.sync({force:true})
		.then(() => {
			console.log(`Database & tables ready!`)
		})
	})

	it('Should return a random number combination', async () => {
		const res = await request(app).get('/api/randomNumber').query({})
		checkStatusCode(res, 200);
	}).timeout(5000);

});

