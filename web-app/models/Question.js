var Sequelize = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('Question', {
    ID: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      references: {
        model: '',
        key: ''
      }
    },
    UserID: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      references: {
        model: 'User',
        key: 'ID'
      }
    },
    StatusID: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      references: {
        model: 'QuestionStatus',
        key: 'ID'
      }
    },
    TypeID: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      references: {
        model: 'QuestionType',
        key: 'ID'
      }
    },
    EventID: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      references: {
        model: 'QuestionEvent',
        key: 'ID'
      }
    },
    PatientJSON: {
      type: Sequelize.STRING,
      allowNull: true
    },
    NextClassifier: {
      type: Sequelize.STRING,
      allowNull: true
    },
    NextOptimizer: {
      type: Sequelize.STRING,
      allowNull: true
    }
  }, {
    tableName: 'Question',
    freezeTableName: true,
    timestamps: false
  });
};
