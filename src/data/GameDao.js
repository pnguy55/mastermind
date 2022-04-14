import { game, player, guess } from '../db/sequelize';
import PlayerDao from './PlayerDao';
import RandomNumberDao from './RandomNumberDao';
import { Op } from 'sequelize';

export default class GameDao {
	constructor() {
    this.playerDao = new PlayerDao();
    this.randomNumberDao = new RandomNumberDao();
	}
  
  async create(gameCreateInfo) {
    // Create a Game
    // Save Game in the database
    try {

      // automatically set random number combination
      const randomNumberCombination = await this.randomNumberDao.fetch();
      gameCreateInfo['combination'] = randomNumberCombination;
      gameCreateInfo['turnCount'] = 0;
      gameCreateInfo['currentTurn'] = 0;
      const gameCreateResult = await game.create(gameCreateInfo)

      return gameCreateResult;
    } catch(err) {
      throw new Error(err.message || 'Some error occurred while creating the Game.')
    }
  }

  async fetchActiveWithPlayersAndGuesses(){
    const includes = []
    const where = {};

    includes.push({
      model: player,
      required: true,
      as: 'players',
      include: [{
        model: guess,
        as: 'guesses',
      }]
    })

    try {
			const gameSearchResults = await game.findAll({  
        logging: (sql, queryObject) => {
          console.log(sql)
        },
        where: where,
        include: includes,
        limit: 1, // default: 50
        offset: 0, // default: 0
        order: [
          ['gameId', 'DESC'],
          [{model: player, as: 'players'}, 'playerId', 'ASC'],
          [{model: player, as: 'players'}, {model: guess, as: 'guesses'}, 'guessId', 'ASC']
       ],
      });
			return gameSearchResults;
		} catch(err) {
			throw new Error(err.message || 'Some error occurred while retrieving games.');
		}
  }

  async search(gameSearchCriteria, limit, offset, isHistorical, allActiveAndHistorical) {

    const { winnerName, playerName } = gameSearchCriteria;

    const includes = []
    const where = {};

    if(playerName) {
      includes.push({
        model: player,
        as: 'players',
        where: { name: `${playerName}`},
      });
    }

    if(winnerName) {
      includes.push({
        model: player,
        as: 'players',
        where: { name: `${winnerName}`},
        force: true
      });
    }

    let paranoid;

    if(isHistorical || allActiveAndHistorical) {
      paranoid = false;
      if(allActiveAndHistorical) {
        where['deletedAt']
      }
      if(isHistorical) where['deletedAt'] = {[Op.ne]: null};
      else if(!allActiveAndHistorical) where['deletedAt'] = {[Op.eq]: null};
  
    }

    try {
			const gameSearchResults = await game.findAll({
        where: where,
        include: includes,
        limit: limit || 50, // default: 50
        offset: offset || 0, // default: 0
        order: [['gameId', 'DESC']],
        paranoid,
      });
			return gameSearchResults;
		} catch(err) {
			throw new Error(err.message || 'Some error occurred while retrieving games.');
		}
  }

  async fetch(gameId) {
		try {
			const gameFetchResult = await game.findByPk(gameId);

			if(gameFetchResult === undefined || gameFetchResult === null) {
				throw new Error(`No game exists with gameId: [${gameId}]`);
			}
      return gameFetchResult;
		} catch(err) {
			throw new Error(err.message);
		}
  }

  async update(gameId, gameUpdateInfo) {
		try {
			// Returns number of games updated.
			const game = await this.fetch(gameId);

      const { turnCount, currentTurn, winner } = gameUpdateInfo;

      game.set({
        turnCount: turnCount === 0 ? 0 : turnCount || game.turnCount,
        currentTurn: currentTurn === 0 ? 0 : currentTurn || game.currentTurn,
        winner: winner || game.winner,
      })

      const gameUpdateResult =  await game.save();
			return gameUpdateResult;
		} catch(err) {
      throw new Error(err.message);
		}
  }

  // cascading soft delete
  async delete(gameId) {
    try {

      const playerIdsByGame = await this.playerDao.search({gameId});
      const playerIds = playerIdsByGame.flatMap((players) => players);

      await guess.destroy({
        where: { playerId: { [Op.in]: playerIds}},
      });
      await player.destroy({
        where: { gameId: gameId },
      });
      await game.destroy({
        where: {gameId: gameId},
      });
      return [gameId];
    } catch(err) {
      throw new Error(err.message);
    }
  }

  // cascading soft deleteAll
  async deleteAll() {
    try {

      // Collect all active games
      await guess.destroy({
        where: {},
      });
      await player.destroy({
        where: {},
      });
      await game.destroy({
        where: {},
      });

    } catch(err) {
      throw new Error(err.message);
    }
  }
}