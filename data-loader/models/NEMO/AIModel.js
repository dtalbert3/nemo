/* jshint indent: 2 */
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
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    AI: {
      type: 'BLOB',
      allowNull: true
    },
    Active: {
      type: 'BIT(1)',
      allowNull: true
    },
		ConfusionMatrix: {
			type: Sequelize.STRING,
			allowNull: true
		}
  }, {
    tableName: 'AIModel',
    freezeTableName: true,
    timestamps: false
  });
};
