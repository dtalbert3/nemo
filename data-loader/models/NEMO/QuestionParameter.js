/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('QuestionParameter', {
    ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      references: {
        model: '',
        key: ''
      }
    },
    QuestionID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'Question',
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
    tableName: 'QuestionParameter',
    freezeTableName: true
  });
};
