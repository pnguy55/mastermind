import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app';
import { sequelize } from '../src/db/sequelize';
import checkStatusCode from './helper/checkStatusCode';
require('./routes.randomNumber.test');

describe('#Suite Game', () => {

	const createGameInfo = {
		playerCount: 2,
	}

	it('Should create a game', async () => {
		const res = await request(app)
			.post('/api/game')
			.set('Content-type', 'application/json')
			.send(createGameInfo)
		checkStatusCode(res, 200);
	}).timeout(10000)

	it('Should return list of games', async () => {
		const res = await request(app).get('/api/game').query({})
		checkStatusCode(res, 200);
	});

	it('Should return 1 game by id', async () => {
		const gameId = 1;
		const res = await request(app).get(`/api/game/:${gameId}`)
		checkStatusCode(res, 200);
	});

	const updateGameInfo = {
		turnCount: 1,
		currentTurn: 1,
	}

	it('Should update a game', async () => {
		const gameId = 1;
		const res = await request(app)
		.put(`/api/game/:${gameId}`)
		.set('Content-type', 'application/json')
		.send(updateGameInfo)
		
		const { body } = res;
		const { turnCount, currentTurn } = body;
		expect(turnCount).to.equal(1);
		expect(currentTurn).to.equal(1);
		checkStatusCode(res, 200);
	});

	it('Should delete 1 game by id', async () => {
		const gameId = 1;
		const deleteRes = await request(app).delete(`/api/game/:${gameId}`)
		checkStatusCode(deleteRes, 200);


		const searchRes = await request(app).get('/api/game').query({})
		expect(searchRes.body).to.have.lengthOf(0);
		checkStatusCode(searchRes, 200);

	});

	it('Should return list of historical games', async () => {
		const res = await request(app).get('/api/game').query({isHistorical: true})
		expect(res.body.deletedAt).to.not.equal(null);
		checkStatusCode(res, 200);
	});


	it('Should delete all games', async () => {
		const createResult1 = await request(app)
		.post('/api/game')
		.set('Content-type', 'application/json')
		.send(createGameInfo)
		checkStatusCode(createResult1, 200);

		const createResult2 = await request(app)
		.post('/api/game')
		.set('Content-type', 'application/json')
		.send(createGameInfo)
		checkStatusCode(createResult2, 200);

		const deleteAllRes = await request(app).delete(`/api/game/`)
		checkStatusCode(deleteAllRes, 200);

		const searchRes = await request(app).get('/api/game').query({})
		expect(searchRes.body).to.have.lengthOf(0);
		checkStatusCode(searchRes, 200);
	}).timeout(5000);

	it('Should return game by playerName', async () => {

		const createGameResult = await request(app)
		.post('/api/game')
		.set('Content-type', 'application/json')
		.send(createGameInfo)
		checkStatusCode(createGameResult, 200);

		const createPlayer1Info = {
			name: 'Phi',
		}
		const createPlayer2Info = {
			name: 'Wynnly',
		}

		const createPlayerResult1 = await request(app)
		.post('/api/player')
		.set('Content-type', 'application/json')
		.send(createPlayer1Info)
		checkStatusCode(createPlayerResult1, 200);

		const createPlayerResult2 = await request(app)
		.post('/api/player')
		.set('Content-type', 'application/json')
		.send(createPlayer2Info)
		checkStatusCode(createPlayerResult2, 200);

		const searchRes = await request(app).get('/api/game').query({playerName: 'Phi'})
		expect(searchRes.body).to.have.lengthOf(1);
		checkStatusCode(searchRes, 200);
	}).timeout(5000);

	it('Should return no games, players, or guesses due to cascade delete', async () => {
		const deleteAllRes = await request(app).delete(`/api/game/`)
		checkStatusCode(deleteAllRes, 200);

		const searchGameRes = await request(app).get('/api/game').query({})
		expect(searchGameRes.body).to.have.lengthOf(0);
		checkStatusCode(searchGameRes, 200);

		let searchPlayerRes = await request(app).get('/api/player').query({})
		expect(searchPlayerRes.body).to.have.lengthOf(0);
		checkStatusCode(searchPlayerRes, 200);
	}).timeout(5000);

  it('Should create a game', async () => {
    const res = await request(app)
      .post('/api/game')
      .set('Content-type', 'application/json')
      .send(createGameInfo)
    checkStatusCode(res, 200);
  })
});
