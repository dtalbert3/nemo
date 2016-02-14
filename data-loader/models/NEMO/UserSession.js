/* jshint indent: 2 */
var Sequelize = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('UserSession', {
    ID: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    UserID: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      references: {
        model: 'User',
        key: 'ID'
      }
    },
    LoginTime: {
      type: Sequelize.DATE,
      allowNull: false
    },
    LastRequest: {
      type: Sequelize.DATE,
      allowNull: false
    }
  }, {
    tableName: 'UserSession',
    freezeTableName: true,
    timestamps: false
  });
};
