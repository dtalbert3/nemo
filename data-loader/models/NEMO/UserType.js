/* jshint indent: 2 */
var Sequelize = require('sequelize');

module.exports = function(sequelize) {
  return sequelize.define('UserType', {
    ID: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    Type: {
      type: Sequelize.STRING,
      allowNull: true
    },
    MaxQuestions: {
      type: Sequelize.INTEGER(1)
    }
  }, {
    tableName: 'UserType',
    freezeTableName: true,
    timestamps: false
  });
};
