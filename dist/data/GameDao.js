'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _sequelize = require('../db/sequelize');

var _PlayerDao = require('./PlayerDao');

var _PlayerDao2 = _interopRequireDefault(_PlayerDao);

var _RandomNumberDao = require('./RandomNumberDao');

var _RandomNumberDao2 = _interopRequireDefault(_RandomNumberDao);

var _sequelize2 = require('sequelize');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class GameDao {
  constructor() {
    this.playerDao = new _PlayerDao2.default();
    this.randomNumberDao = new _RandomNumberDao2.default();
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
      const gameCreateResult = await _sequelize.game.create(gameCreateInfo);

      return gameCreateResult;
    } catch (err) {
      throw new Error(err.message || 'Some error occurred while creating the Game.');
    }
  }

  async fetchActiveWithPlayersAndGuesses() {
    const includes = [];
    const where = {};

    includes.push({
      all: true,
      nested: true
    });

    where['deletedAt'] = { [_sequelize2.Op.eq]: null };

    try {
      const gameSearchResults = await _sequelize.game.findAll({
        where: where,
        include: includes,
        limit: 1, // default: 50
        offset: 0, // default: 0
        order: [['gameId', 'DESC']]
      });
      return gameSearchResults;
    } catch (err) {
      throw new Error(err.message || 'Some error occurred while retrieving games.');
    }
  }

  async search(gameSearchCriteria, limit, offset, isHistorical, allActiveAndHistorical) {

    const { winnerName, playerName } = gameSearchCriteria;

    const includes = [];
    const where = {};

    if (playerName) {
      includes.push({
        model: _sequelize.player,
        as: 'players',
        where: { name: `${playerName}` }
      });
    }

    if (winnerName) {
      includes.push({
        model: _sequelize.player,
        as: 'players',
        where: { name: `${winnerName}` },
        force: true
      });
    }

    let paranoid;

    if (isHistorical || allActiveAndHistorical) {
      paranoid = false;
      if (allActiveAndHistorical) {
        where['deletedAt'];
      }
      if (isHistorical) where['deletedAt'] = { [_sequelize2.Op.ne]: null };else if (!allActiveAndHistorical) where['deletedAt'] = { [_sequelize2.Op.eq]: null };
    }

    try {
      const gameSearchResults = await _sequelize.game.findAll({
        where: where,
        include: includes,
        limit: limit || 50, // default: 50
        offset: offset || 0, // default: 0
        order: [['gameId', 'DESC']],
        paranoid
      });
      return gameSearchResults;
    } catch (err) {
      throw new Error(err.message || 'Some error occurred while retrieving games.');
    }
  }

  async fetch(gameId) {
    try {
      const gameFetchResult = await _sequelize.game.findByPk(gameId);

      if (gameFetchResult === undefined || gameFetchResult === null) {
        throw new Error(`No game exists with gameId: [${gameId}]`);
      }
      return gameFetchResult;
    } catch (err) {
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
        winner: winner || game.winner
      });

      const gameUpdateResult = await game.save();
      return gameUpdateResult;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  // cascading soft delete
  async delete(gameId) {
    try {

      const playerIdsByGame = await this.playerDao.search({ gameId });
      const playerIds = playerIdsByGame.flatMap(players => players);

      await _sequelize.guess.destroy({
        where: { playerId: { [_sequelize2.Op.in]: playerIds } }
      });
      await _sequelize.player.destroy({
        where: { gameId: gameId }
      });
      await _sequelize.game.destroy({
        where: { gameId: gameId }
      });
      return [gameId];
    } catch (err) {
      throw new Error(err.message);
    }
  }

  // cascading soft deleteAll
  async deleteAll() {
    try {

      // Collect all active games
      await _sequelize.guess.destroy({
        where: {}
      });
      await _sequelize.player.destroy({
        where: {}
      });
      await _sequelize.game.destroy({
        where: {}
      });
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
exports.default = GameDao;
//# sourceMappingURL=GameDao.js.map