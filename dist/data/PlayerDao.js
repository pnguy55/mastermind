'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _sequelize = require('../db/sequelize');

var _sequelize2 = require('sequelize');

var _GameDao = require('./GameDao');

var _GameDao2 = _interopRequireDefault(_GameDao);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class PlayerDao {
  constructor() {}

  async create(playerCreateInfo) {
    // Create a Player
    // Save Player in the database
    try {
      // TODO: generate player turn number here

      const games = await _sequelize.game.findAll({ where: { deletedAt: { [_sequelize2.Op.eq]: null } } });

      const activeGame = games.length > 0;

      if (!activeGame) throw new Error('No active game. Cannot create a player.');
      const currentGame = games[0];

      const numberOfActivePlayers = (await this.search({})).length;
      playerCreateInfo.turnNumber = numberOfActivePlayers;
      playerCreateInfo.gameId = currentGame.gameId;
      playerCreateInfo.score = 0;

      const playerCreateResult = await _sequelize.player.create(playerCreateInfo);

      return playerCreateResult;
    } catch (err) {
      throw new Error(err.message || 'Some error occurred while creating the Player.');
    }
  }

  async search(playerSearchCriteria, limit, offset, isHistorical) {

    const { playerName, gameId } = playerSearchCriteria;

    const includes = [];
    const where = {};

    if (gameId) {
      where['gameId'] = gameId;
    }
    if (playerName) {
      where['playerName'] = playerName;
    }

    if (isHistorical) where['deletedAt'] = { [_sequelize2.Op.ne]: null };else where['deletedAt'] = { [_sequelize2.Op.eq]: null };

    try {
      const playerSearchResults = await _sequelize.player.findAll({
        where: where,
        include: includes,
        limit: limit || 50, // default: 50
        offset: offset || 0, // default: 0
        order: [['playerId', 'ASC']]
      });
      return playerSearchResults;
    } catch (err) {
      throw new Error(err.message || 'Some error occurred while retrieving players.');
    }
  }

  async fetch(playerId) {
    try {
      const playerFetchResult = await _sequelize.player.findByPk(playerId);

      if (playerFetchResult === undefined) {
        throw new Error(`No player exists with playerId: [${playerId}]`);
      }
      return playerFetchResult;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async update(playerId, playerUpdateInfo) {
    try {
      // Returns number of players updated.
      const player = await this.fetch(playerId);

      const { name, score } = playerUpdateInfo;

      player.set({
        name: name || player.name,
        score: score === 0 ? 0 : score || player.score
      });

      const playerUpdateResult = await player.save();
      return playerUpdateResult;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  // cascading soft delete
  async delete(playerId) {
    try {
      await _sequelize.guess.destroy({
        where: { playerId: playerId }
      });
      await _sequelize.player.destroy({
        where: { playerId: playerId }
      });
      return [playerId];
    } catch (err) {
      throw new Error(err.message);
    }
  }

  // cascading soft deleteAll
  async deleteAll() {
    try {
      const playerIds = (await this.search({})).map(({ playerId }) => playerId);

      await _sequelize.guess.destroy({
        where: { playerId: { [_sequelize2.Op.in]: playerIds } }
      });
      await _sequelize.player.destroy({ where: {} });

      return [playerIds];
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
exports.default = PlayerDao;
//# sourceMappingURL=PlayerDao.js.map