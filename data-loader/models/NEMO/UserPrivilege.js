/* jshint indent: 2 */
var Sequelize = require('sequelize');

module.exports = function(sequelize) {
  return sequelize.define('UserPrivilege', {
    ID: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    UserTypeID: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      references: {
        model: 'UserType',
        key: 'ID'
      }
    },
    Privilege: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, {
    tableName: 'UserPrivilege',
    freezeTableName: true,
    timestamps: false
  });
};
