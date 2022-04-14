import Sequelize from 'sequelize';
import GameModel from '../models/game';
import PlayerModel from '../models/player';
import GuessModel from '../models/guess';

const sequelize = new Sequelize(
	'database',
	null,
	null,
	{  
    // disable logging; default: console.log
    logging: false,
		dialect: 'sqlite',
		// Data is stored in the file `database.sqlite` in the folder `db`.
		// Note that if you leave your app public, this database
		// file will be copied if
		// someone forks your app. So don't use it to store sensitive information.
		storage: `${process.cwd()}/src/db/database.sqlite`,
	}
);

const game = GameModel(sequelize, Sequelize);
const player = PlayerModel(sequelize, Sequelize);
const guess = GuessModel(sequelize, Sequelize);

game.hasMany(
	player, 
	{
		foreignKey: {
			name: 'gameId',
			field: 'gameId',
			allowNull: false,
		},
		as: 'players',
		hooks: true,
	},
);
	
player.hasMany(
	guess, 
	{
		foreignKey: {
			name: 'playerId',
			field: 'playerId',
			allowNull: false,
		},
		as: 'guesses',
		hooks: true,
	},
);
// edit the following force: false to true to reset db on each time you run the application.
sequelize.sync({force: false})
  .then(() => {
    console.log(`Database & tables created!`)
  })

module.exports = {
  sequelize,
  game,
  player,
  guess,
}