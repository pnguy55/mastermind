'use strict';

module.exports = (sequelize, type) => {
	return sequelize.define('player', {
		playerId: {
			type: type.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		name: {
			type: type.STRING,
			allowNull: false
		},
		score: {
			type: type.INTEGER,
			allowNull: false
		},
		turnNumber: {
			type: type.INTEGER,
			allowNull: false
		}
	}, {
		tableName: 'player',
		deletedAt: 'deletedAt',
		paranoid: true,
		timestamps: true
	});
};
//# sourceMappingURL=player.js.map