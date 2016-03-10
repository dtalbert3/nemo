/* jshint indent: 2 */
var Sequelize = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('QuestionStatus', {
    ID: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      references: {
        model: '',
        key: ''
      }
    },
    Status: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, {
    tableName: 'QuestionStatus',
    freezeTableName: true,
    timestamps: false
  });
};
