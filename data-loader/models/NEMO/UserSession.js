/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('UserSession', {
    ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    UserID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'User',
        key: 'ID'
      }
    },
    LoginTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    LastRequest: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'UserSession',
    freezeTableName: true
  });
};
