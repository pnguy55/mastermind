import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app';
import { sequelize } from '../src/db/sequelize';
import checkStatusCode from './helper/checkStatusCode';
require('./routes.game.test');
describe('#Suite Player', () => {

	const createPlayerInfo = {
		name: 'Phi',
	}
	const createPlayerInfo2 = {
		name: 'Wynnly',
	}

	it('Should create a player', async () => {
		const res = await request(app)
			.post('/api/player')
			.set('Content-type', 'application/json')
			.send(createPlayerInfo)
		checkStatusCode(res, 200);
	})

	it('Should return list of players', async () => {
		const res = await request(app).get('/api/player').query({})
		checkStatusCode(res, 200);
	});

	it('Should return 1 player by id', async () => {
		const playerId = 3;
		const res = await request(app).get(`/api/player/:${playerId}`)
		checkStatusCode(res, 200);
	});

	const updatePlayerInfo = {
    name: 'Wynnly',
		score: 1,
	}

	it('Should update a player', async () => {		
		const searchRes = await request(app).get('/api/player').query({})
		checkStatusCode(searchRes, 200);

		const playerId = searchRes.body[0].playerId;
		const res = await request(app)
		.put(`/api/player/:${playerId}`)
		.set('Content-type', 'application/json')
		.send(updatePlayerInfo)
		
		const { body } = res;
    const { name, score } = body;

    expect(name).to.equal('Wynnly')
		expect(score).to.equal(1);
		checkStatusCode(res, 200);
	});

	it('Should delete 1 player by id', async () => {
		const searchRes = await request(app).get('/api/player').query({})
		checkStatusCode(searchRes, 200);

		const playerId = searchRes.body[0].playerId;
		const deleteRes = await request(app).delete(`/api/player/:${playerId}`)
		checkStatusCode(deleteRes, 200);


		const searchAfterDeleteRes = await request(app).get('/api/player').query({})
		expect(searchAfterDeleteRes.body).to.have.lengthOf(0);
		checkStatusCode(searchAfterDeleteRes, 200);

	});

	it('Should return list of historical players', async () => {
		const res = await request(app).get('/api/player').query({isHistorical: true})
		expect(res.body.deletedAt).to.not.equal(null);
		checkStatusCode(res, 200);
	});


	it('Should delete all players and guesses', async () => {

		const createPlayerResult1 = await request(app)
		.post('/api/player')
		.set('Content-type', 'application/json')
		.send(createPlayerInfo)
		checkStatusCode(createPlayerResult1, 200);
	
		const createPlayerResult2 = await request(app)
		.post('/api/player')
		.set('Content-type', 'application/json')
		.send(createPlayerInfo2)
		checkStatusCode(createPlayerResult2, 200);

		const createGuess1Info = {
			playerId: createPlayerResult1.body.playerId,
			guess: '1|2|3|4'
		}

		const createGuess2Info = {
			playerId: createPlayerResult2.body.playerId,
			guess: '1|2|3|5'
		}

		const createGuessResult1 = await request(app)
		.post('/api/guess')
		.set('Content-type', 'application/json')
		.send(createGuess1Info)
		checkStatusCode(createGuessResult1, 200);

		const createGuessResult2 = await request(app)
		.post('/api/guess')
		.set('Content-type', 'application/json')
		.send(createGuess2Info)
		checkStatusCode(createGuessResult2, 200);

		const deleteAllRes = await request(app).delete(`/api/player/`)
		checkStatusCode(deleteAllRes, 200);

		const searchPlayerRes = await request(app).get('/api/player').query({})
		expect(searchPlayerRes.body).to.have.lengthOf(0);
		checkStatusCode(searchPlayerRes, 200);

		const searchGuessRes = await request(app).get('/api/guess').query({})
		expect(searchGuessRes.body).to.have.lengthOf(0);
		checkStatusCode(searchGuessRes, 200);
	}).timeout(5000);

	it('Should create two players', async () => {

		const createPlayerResult1 = await request(app)
		.post('/api/player')
		.set('Content-type', 'application/json')
		.send(createPlayerInfo)
		checkStatusCode(createPlayerResult1, 200);
	
		const createPlayerResult2 = await request(app)
		.post('/api/player')
		.set('Content-type', 'application/json')
		.send(createPlayerInfo2)
		checkStatusCode(createPlayerResult2, 200);
	})
});

