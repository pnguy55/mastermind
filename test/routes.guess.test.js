import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app';
import { sequelize } from '../src/db/sequelize';
import checkStatusCode from './helper/checkStatusCode';
require('./routes.player.test');

describe('#Suite Guess', () => {
	
	it('Should create a guess', async () => {	
		const searchRes = await request(app).get('/api/player').query({})
		checkStatusCode(searchRes, 200);

		const playerId = searchRes.body[0].playerId;

		const createGuessInfo = {
			playerId: playerId,
			guess: '1|2|3|6',
		}
		const res = await request(app)
			.post('/api/guess')
			.set('Content-type', 'application/json')
			.send(createGuessInfo)
		checkStatusCode(res, 200);
	})

	it('Should return list of guesses', async () => {
		const res = await request(app).get('/api/guess').query({})
		checkStatusCode(res, 200);
	});

	it('Should return 1 guess by id', async () => {
		const guessId = 1;
		const res = await request(app).get(`/api/guess/:${guessId}`)
		checkStatusCode(res, 200);
	});

	it('Should delete 1 guess by id', async () => {
		const searchRes = await request(app).get('/api/guess').query({})
		checkStatusCode(searchRes, 200);

		const guessId = searchRes.body[0].guessId;
		const deleteRes = await request(app).delete(`/api/guess/:${guessId}`)
		checkStatusCode(deleteRes, 200);


		const searchAfterDeleteRes = await request(app).get('/api/guess').query({})
		expect(searchAfterDeleteRes.body).to.have.lengthOf(0);
		checkStatusCode(searchAfterDeleteRes, 200);

	});

	it('Should return list of historical guesses', async () => {
		const res = await request(app).get('/api/guess').query({isHistorical: true})
		expect(res.body.deletedAt).to.not.equal(null);
		checkStatusCode(res, 200);
	});


	it('Should delete all guesses', async () => {
		const searchRes = await request(app).get('/api/player').query({})
		checkStatusCode(searchRes, 200);

		const playerId = searchRes.body[1].playerId;

		const createGuessInfo = {
			playerId: playerId,
			guess: '1|2|3|7',
		}

		const createResult1 = await request(app)
		.post('/api/guess')
		.set('Content-type', 'application/json')
		.send(createGuessInfo)
		checkStatusCode(createResult1, 200);

		const deleteAllRes = await request(app).delete(`/api/guess/`)
		checkStatusCode(deleteAllRes, 200);

		const searchAfterDeleteRes = await request(app).get('/api/guess').query({})
		expect(searchAfterDeleteRes.body).to.have.lengthOf(0);
		checkStatusCode(searchAfterDeleteRes, 200);

	});

	it('Should play a full game', async () => {
		const searchRes = await request(app).get('/api/player').query({})
		checkStatusCode(searchRes, 200);

		const playerId1 = searchRes.body[0].playerId;
		const playerId2 = searchRes.body[1].playerId;

		const createGuessInfoPlayer1 = {
			playerId: playerId1,
			guess: '9|9|9|9',
		}
		const createGuessInfoPlayer2 = {
			playerId: playerId2,
			guess: '9|9|9|9',
		}
		let count = 20;
		let myTurn = true;

		while(count > 0) {
			if(myTurn) {
				const createResult = await request(app)
				.post('/api/guess')
				.set('Content-type', 'application/json')
				.send(createGuessInfoPlayer1)
				checkStatusCode(createResult, 200);
			} else {
				const createResult = await request(app)
				.post('/api/guess')
				.set('Content-type', 'application/json')
				.send(createGuessInfoPlayer2)
				checkStatusCode(createResult, 200);
			}
			myTurn = !myTurn;
			count--;
		}
	}).timeout(10000);

	it('Should not allow a guess with no active game.', async () => {

		const createGuessInfoPlayer1 = {
			playerId: 7,
			guess: '9|9|9|9',
		}
		const createResult = await request(app)
		.post('/api/guess')
		.set('Content-type', 'application/json')
		.send(createGuessInfoPlayer1)
		checkStatusCode(createResult, 500);

	});

	it('Should reset db', async () => {
		await sequelize.sync({force:true})
		.then(() => {
			console.log(`Database & tables reset!`)
		})
  })

});

