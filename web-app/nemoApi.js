var Sequelize = require('sequelize');
var config = require('getconfig');

// Create database
var sequelize = new Sequelize(
  config.server.db.name,
  config.server.db.username,
  config.server.db.password,
  {
    host: config.server.db.host,
    dialect: config.server.db.dialect,
    port:    config.server.db.port
  });

// Test connection to database
sequelize
  .authenticate()
  .then(function() {
    console.log('[*] Connection to ' + config.server.db.name + ' database established');
  }, function (err) {
    console.log('[ ] Unable to connect to ' + config.server.db.name + ' database: ', err);
  });

var userModel = require('./client/models/user')(sequelize);
// Model really not even required here too :)! Remove later . . .
exports.userService = {

  // Can use this to authenticate
  // We should send back a token to be used upon each request
  find: function(params, callback) {
    sequelize
      .query('SELECT * FROM User', { model: userModel })
      .then(function(data) {
        return callback(null, data);
      }, function(error) {
        return callback(error, null);
      });
  }

  // get: function(id, params, callback) {
  //
  // },
  //
  // create: function(data, params, callback) {
  //
  // },
  //
  // update: function(id, data, params, callback) {
  //
  // },
  //
  // patch: function(id, data, params, callback) {
  //
  // },
  //
  // remove: function(id, params, callback) {
  //
  // },
  //
  // setup: function(app, path) {
  //
  // }
};

exports.dashboardService = {

};

// var questionParameterModel = require('./models/QuestionParameter')(sequelize);
var parameterTypeModel = require('./models/ParameterType')(sequelize);
exports.questionService = {

  // Fetch parameters allowed to be used by client
  find: function(params, callback) {
    sequelize.transaction(function() {
      return parameterTypeModel.findAll()
        .then(function(data) {
          return callback(null, data);
        }, function(error) {
          return callback(error, null);
        });
    });
  }
};
