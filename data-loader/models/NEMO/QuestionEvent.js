/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('QuestionEvent', {
    ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      references: {
        model: '',
        key: ''
      }
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
    }
  }, {
    tableName: 'QuestionEvent',
    freezeTableName: true
  });
};
