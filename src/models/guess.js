module.exports = (sequelize, type) => {
		return sequelize.define('guess', {
			guessId: {
				type: type.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			guess: {
				type: type.STRING,
				allowNull: false,
			},
			feedback: {
				type: type.STRING,
				allowNull: false,
			},
		},
		{
			tableName: 'guess',
			deletedAt: 'deletedAt',
			paranoid: true,
			timestamps: true,
		}
	)
}
