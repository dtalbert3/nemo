/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ParameterType', {
    ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    Name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    concept_path: {
      type: DataTypes.STRING,
      allowNull: true
    },
    concept_cd: {
      type: DataTypes.STRING,
      allowNull: true
    },
    valtype_cd: {
      type: DataTypes.STRING,
      allowNull: false
    },
    TableName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    TableColumn: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'ParameterType',
    freezeTableName: true
  });
};
