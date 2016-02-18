var Sequelize = require('sequelize');

module.exports = function(sequelize) {
  return sequelize.define('User', {
    ID: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    UserTypeID: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      references: {
        model: 'UserType',
        key: 'ID'
      }
    },
    Name: {
      type: Sequelize.STRING,
      allowNull: true
    },
    Hash: {
      type: Sequelize.STRING,
      allowNull: true
    },
    Salt: {
      type: Sequelize.STRING,
      allowNull: true
    }
  }, {
    tableName: 'User',
    freezeTableName: true,
    timestamps: false
  });
};
