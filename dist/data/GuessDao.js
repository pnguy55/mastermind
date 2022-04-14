'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _sequelize = require('../db/sequelize');

var _sequelize2 = require('sequelize');

var _GameDao = require('./GameDao');

var _GameDao2 = _interopRequireDefault(_GameDao);

var _PlayerDao = require('./PlayerDao');

var _PlayerDao2 = _interopRequireDefault(_PlayerDao);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class GuessDao {
  constructor() {
    this.gameDao = new _GameDao2.default();
    this.playerDao = new _PlayerDao2.default();
  }

  // make a guess

  generateFeedbackAndScore(guess, combination) {
    const combinationArray = combination.split('|');
    const combinationMap = new Map();
    for (let i = 0; i < combinationArray.length; i++) {
      const num = combinationArray[i];
      const existingNumIndexes = combinationMap.get(num) || [];
      existingNumIndexes.push(i);
      combinationMap.set(num, existingNumIndexes);
    }

    const guessArray = guess.split('|');

    let feedbackArray = new Array(4);
    let score = 0;
    for (const num of guessArray) {
      if (combinationMap.has(num)) {
        const indexes = combinationMap.get(num);
        for (const index of indexes) {
          feedbackArray[index] = 'X';
        }
        score++;
      }
    }

    for (let j = 0; j < feedbackArray.length; j++) {
      const feedback = feedbackArray[j];
      if (feedback === undefined) {
        feedbackArray[j] = 'O';
      }
    }

    return [feedbackArray.join('|'), score];
  }

  async create(guessCreateInfo) {
    // Create a Guess
    // Save Guess in the database
    try {

      // Get game info (only one active game at a time) and player info
      let { playerId, guess: guessString } = guessCreateInfo;
      const activeGameInfo = (await this.gameDao.search({}))[0];
      const playerInfo = await this.playerDao.fetch(playerId);

      // game is over, throw error
      if (!activeGameInfo) throw new Error('Game is over.  Start a new game.');
      const { gameId, combination, playerCount, currentTurn, winner } = activeGameInfo;
      const { name, score, turnNumber } = playerInfo;

      // make sure only current player can guess
      if (currentTurn !== turnNumber) throw new Error(`It is not ${name}'s turn`);

      const activeGameCombination = combination;
      const winningCombination = activeGameCombination === guessString;

      // TODO: need to implement
      const [feedback, guessScore] = this.generateFeedbackAndScore(guessString, combination);

      guessCreateInfo.feedback = feedback;
      const guessCreateResult = await _sequelize.guess.create(guessCreateInfo);

      const updatePlayerInfo = {
        score: winningCombination ? score + 8 : score + guessScore
      };
      const playerUpdateResult = await this.playerDao.update(playerId, updatePlayerInfo);

      const activeGuesses = (await this.search({})) || [];
      const numberOfActiveGuesses = activeGuesses.length;
      const turnCount = numberOfActiveGuesses === 0 ? 0 : Math.trunc(numberOfActiveGuesses / playerCount);
      const nextTurn = currentTurn + 1 >= playerCount ? 0 : currentTurn + 1;
      // Case where we hit turn limit.
      let gameUpdateInfo;
      let winnersByDefault = winner;
      if (winningCombination || turnCount === 10) {
        if (!winningCombination) {
          const players = await this.playerDao.search({});
          const scoreMap = new Map();
          let highestScore = 0;
          for (const player of players) {
            let existingPlayersWithScore = scoreMap.get(player.score) || [];
            existingPlayersWithScore.push(player.name);
            scoreMap.set(player.score, existingPlayersWithScore);
            highestScore = Math.max(highestScore, player.score);
          }

          winnersByDefault = scoreMap.get(highestScore).join(' and ');
        }

        gameUpdateInfo = {
          turnCount: turnCount,
          currentTurn: nextTurn,
          winner: winningCombination ? name : winnersByDefault
        };
        await this.gameDao.update(gameId, gameUpdateInfo);
        await this.gameDao.deleteAll();
      }
      // case of no winner declared by this guess
      else {
          gameUpdateInfo = {
            turnCount: turnCount,
            currentTurn: nextTurn,
            winner: winningCombination ? name : winnersByDefault
          };
          await this.gameDao.update(gameId, gameUpdateInfo);
        }

      return guessCreateResult;
    } catch (err) {
      throw new Error(err.message || 'Some error occurred while creating the Guess.');
    }
  }

  async search(guessSearchCriteria, limit, offset, isHistorical) {

    const { playerName } = guessSearchCriteria;

    const includes = [];
    const where = {};

    if (playerName) {
      includes.push({
        model: models.player,
        as: 'playerName',
        where: { name: `${playerName}` }
      });
    }

    if (isHistorical) where['deletedAt'] = { [_sequelize2.Op.ne]: null };else where['deletedAt'] = { [_sequelize2.Op.eq]: null };

    try {
      const guessSearchResults = await _sequelize.guess.findAll({
        where: where,
        include: includes,
        limit: limit || 50, // default: 50
        offset: offset || 0, // default: 0
        order: [['guessId', 'DESC']]
      });
      return guessSearchResults;
    } catch (err) {
      throw new Error(err.message || 'Some error occurred while retrieving guesses.');
    }
  }

  async fetch(guessId) {
    try {
      const guessFetchResult = await _sequelize.guess.findByPk(guessId);

      if (guessFetchResult === undefined) {
        throw new Error(`No guess exists with guessId: [${guessId}]`);
      }
      return guessFetchResult;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async delete(guessId) {
    try {
      const guessDeleteResult = await _sequelize.guess.destroy({
        where: { guessId: guessId }
      });
      return [guessId];
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async deleteAll() {
    try {
      const guessIds = (await this.search({})).map(({ guessId }) => guessId);
      await _sequelize.guess.destroy({ where: {} });
      return [guessIds];
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
exports.default = GuessDao;
//# sourceMappingURL=GuessDao.js.map