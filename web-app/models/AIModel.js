var Sequelize = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('AIModel', {
    ID: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    QuestionID: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      references: {
        model: 'Question',
        key: 'ID'
      }
    },
    Value: {
      type: Sequelize.STRING,
      allowNull: true
    },
    Accuracy: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    AIFeedback: {
      type: 'BIT(1)',
      allowNull: true
    },
    PredictionFeedback: {
      type: Sequelize.BOOLEAN,
      allowNull: true
    },
    Algorithm: {
      type: Sequelize.STRING,
      allowNull: true
    },
		ConfusionMatrix: {
			type: Sequelize.STRING,
			allowNull: true
		},
    Optimizer: {
			type: Sequelize.STRING,
			allowNull: true
		},
    DateModified: {
      type: Sequelize.DATE,
      allowNull: true
    }
  }, {
    tableName: 'AIModel',
    freezeTableName: true,
    timestamps: false
  });
};
