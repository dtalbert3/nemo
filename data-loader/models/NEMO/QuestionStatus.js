/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('QuestionStatus', {
    ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      references: {
        model: '',
        key: ''
      }
    },
    Status: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'QuestionStatus',
    freezeTableName: true
  });
};
