'use strict';

var _sequelize = require('sequelize');

var _sequelize2 = _interopRequireDefault(_sequelize);

var _game = require('../models/game');

var _game2 = _interopRequireDefault(_game);

var _player = require('../models/player');

var _player2 = _interopRequireDefault(_player);

var _guess = require('../models/guess');

var _guess2 = _interopRequireDefault(_guess);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const sequelize = new _sequelize2.default('database', null, null, {
	// disable logging; default: console.log
	logging: false,
	dialect: 'sqlite',
	// Data is stored in the file `database.sqlite` in the folder `db`.
	// Note that if you leave your app public, this database
	// file will be copied if
	// someone forks your app. So don't use it to store sensitive information.
	storage: `${process.cwd()}/src/db/database.sqlite`
});

const game = (0, _game2.default)(sequelize, _sequelize2.default);
const player = (0, _player2.default)(sequelize, _sequelize2.default);
const guess = (0, _guess2.default)(sequelize, _sequelize2.default);

game.hasMany(player, {
	foreignKey: {
		name: 'gameId',
		field: 'gameId',
		allowNull: false
	},
	as: 'players',
	hooks: true
});

player.hasMany(guess, {
	foreignKey: {
		name: 'playerId',
		field: 'playerId',
		allowNull: false
	},
	as: 'guesses'
});
// edit the following force: false to true to reset db on each time you run the application.
sequelize.sync({ force: false }).then(() => {
	console.log(`Database & tables created!`);
});

module.exports = {
	sequelize,
	game,
	player,
	guess
};
//# sourceMappingURL=sequelize.js.map