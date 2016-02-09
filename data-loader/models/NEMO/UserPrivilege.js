/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('UserPrivilege', {
    ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    UserTypeID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'UserType',
        key: 'ID'
      }
    },
    Privilege: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'UserPrivilege',
    freezeTableName: true
  });
};
