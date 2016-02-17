/* jshint indent: 2 */
var Sequelize = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('QuestionType', {
    ID: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      references: {
        model: '',
        key: ''
      }
    },
    Type: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, {
    tableName: 'QuestionType',
    freezeTableName: true,
    timestamps: false
  });
};
