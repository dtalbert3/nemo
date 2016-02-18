var Sequelize = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('QuestionEvent', {
    ID: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      references: {
        model: '',
        key: ''
      }
    },
    Name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    concept_path: {
      type: Sequelize.STRING,
      allowNull: true
    },
    concept_cd: {
      type: Sequelize.STRING,
      allowNull: true
    }
  }, {
    tableName: 'QuestionEvent',
    freezeTableName: true,
    timestamps: false
  });
};
