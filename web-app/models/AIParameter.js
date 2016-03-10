var Sequelize = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('AIParameter', {
    ID: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    AIModelID: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      references: {
        model: 'AIModel',
        key: 'ID'
      }
    },
    TypeID: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      references: {
        model: 'ParameterType',
        key: 'ID'
      }
    },
    tval_char: {
      type: Sequelize.STRING,
      allowNull: true
    },
    nval_num: {
      type: Sequelize.DECIMAL,
      allowNull: true
    }
  }, {
    tableName: 'AIParameter',
    freezeTableName: true,
    timestamps: false
  });
};
