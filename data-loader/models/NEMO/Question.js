/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Question', {
    ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      references: {
        model: '',
        key: ''
      }
    },
    UserID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'User',
        key: 'ID'
      }
    },
    StatusID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'QuestionStatus',
        key: 'ID'
      }
    },
    TypeID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'QuestionType',
        key: 'ID'
      }
    },
    EventID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'QuestionEvent',
        key: 'ID'
      }
    }
  }, {
    tableName: 'Question',
    freezeTableName: true
  });
};
