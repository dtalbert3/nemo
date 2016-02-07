var Sequelize = require('sequelize');

module.exports = function (sequelize) {

    var User = sequelize.define('User', {
      Name: Sequelize.STRING,
      Password: Sequelize.STRING
    }, {
      timestamps: false,
      freezeTableName: true,
      tableName: 'User'
    });

    return User;
};
