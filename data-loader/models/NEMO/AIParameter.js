/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('AIParameter', {
    ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    AIModelID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'AIModel',
        key: 'ID'
      }
    },
    TypeID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'ParameterType',
        key: 'ID'
      }
    },
    tval_char: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nval_num: {
      type: DataTypes.DECIMAL,
      allowNull: true
    }
  }, {
    tableName: 'AIParameter',
    freezeTableName: true
  });
};
