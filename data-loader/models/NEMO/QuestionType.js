/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('QuestionType', {
    ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      references: {
        model: '',
        key: ''
      }
    },
    Type: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'QuestionType',
    freezeTableName: true
  });
};
