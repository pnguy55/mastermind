'use strict';

var _sequelize = require('../db/sequelize');

module.exports = (sequelize, type) => {
	return sequelize.define('game', {
		gameId: {
			type: type.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		combination: {
			type: type.STRING,
			allowNull: false
		},
		playerCount: {
			type: type.INTEGER,
			allowNull: false
		},
		turnCount: {
			type: type.INTEGER,
			allowNull: false
		},
		currentTurn: {
			type: type.INTEGER,
			allowNull: false
		},
		winner: {
			type: type.INTEGER,
			allowNull: true
		}
	}, {
		tableName: 'game',
		deletedAt: 'deletedAt',
		paranoid: true,
		timestamps: true
	});
};
//# sourceMappingURL=game.js.map