/* jshint indent: 2 */
var Sequelize = require('sequelize');

module.exports = function(sequelize) {
  return sequelize.define('QuestionParameter', {
    ID: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      references: {
        model: '',
        key: ''
      }
    },
    QuestionID: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      references: {
        model: 'Question',
        key: 'ID'
      }
    },
    // TypeID: {
    //   type: Sequelize.INTEGER(11),
    //   allowNull: true,
    //   references: {
    //     model: 'ParameterType',
    //     key: 'ID'
    //   }
    // },
    tval_char: {
      type: Sequelize.STRING,
      allowNull: true
    },
    nval_num: {
      type: Sequelize.DECIMAL,
      allowNull: true,
    },
    upper_bound: {
      type: Sequelize.BOOLEAN,
      allowNull: true
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
    min: {
      type: Sequelize.DECIMAL,
      allowNull: true,
    },
    max: {
      type: Sequelize.DECIMAL,
      allowNull: true,
    }
  }, {
    tableName: 'QuestionParameter',
    freezeTableName: true,
    timestamps: false
  });
};
