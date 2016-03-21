var Sequelize = require('sequelize');
module.exports = function(sequelize) {
	return sequelize.define('AIModelParams', {
		ID: {
			type: Sequelize.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		AIModel: {
			type: Sequelize.INTEGER(11),
			allowNull: false,
			primaryKey: false,
			references: {
				model: 'AIModel',
				key: 'ID'
			}
		},
		Param: {
			type: Sequelize.STRING,
			allowNull: false
		},
		Value: {
			type: Sequelize.STRING,
			allowNull: true
		},
		param_use: {
			type: Sequelize.STRING,
			allowNull: false
		}
	}, {
		tableName: 'AIModelParams',
		freezeTableName: true,
		timestamps: false
	});
};
