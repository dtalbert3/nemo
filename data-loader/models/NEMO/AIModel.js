/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('AIModel', {
    ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    QuestionID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'Question',
        key: 'ID'
      }
    },
    Value: {
      type: DataTypes.STRING,
      allowNull: true
    },
    Accuracy: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    AIFeedback: {
      type: 'BIT(1)',
      allowNull: true
    },
    PredictionFeedback: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    AI: {
      type: 'BLOB',
      allowNull: true
    },
    Active: {
      type: 'BIT(1)',
      allowNull: true
    }
  }, {
    tableName: 'AIModel',
    freezeTableName: true
  });
};
