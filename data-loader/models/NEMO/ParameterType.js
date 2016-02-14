/* jshint indent: 2 */
var Sequelize = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('ParameterType', {
    ID: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
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
    },
    valtype_cd: {
      type: Sequelize.STRING,
      allowNull: false
    },
    TableName: {
      type: Sequelize.STRING,
      allowNull: true
    },
    TableColumn: {
      type: Sequelize.STRING,
      allowNull: true
    },
    upper_bound: {
      type: Sequelize.BOOLEAN,
      allowNull: true
    },
    unbounded: {
      type: Sequelize.BOOLEAN,
      allowNull: true
    }
  }, {
    tableName: 'ParameterType',
    freezeTableName: true,
    timestamps: false
  });
};
