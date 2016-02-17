var Sequelize = require('sequelize');
var config = require('getconfig');

// Create database connection
var sequelize = new Sequelize(
  config.server.db.name,
  config.server.db.username,
  config.server.db.password, {
    host: config.server.db.host,
    dialect: config.server.db.dialect,
    port: config.server.db.port,
    logging: (config.server.db.logging) ? console.log : false
  });

// Test connection to database
// Need to add error logging for this part

sequelize
  .authenticate()
  .then(function() {
    console.log('[*] Connection to ' + config.server.db.name +
      ' database established');
  }, function(err) {
    console.log('[ ] Unable to connect to ' + config.server.db.name +
      ' database: ', err);
  });

var userModel = require('./client/models/user')(sequelize);
// Model really not even required here too :)! Remove later . . .
exports.userService = {

  // Can use this to authenticate
  // We should send back a token to be used upon each request
  find: function(params, callback) {
    sequelize
      .query('SELECT * FROM User', {
        model: userModel
      })
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

// Definition of parameter type model for ParameterType table in NEMO Datamart
var parameterTypeModel = require('./models/ParameterType')(sequelize);
exports.questionParameters = {

  // Fetch parameters allowed to be used by client from database
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

// Definition of question type model for QuestionType table in NEMO Datamart
var questionTypeModel = require('./models/QuestionType')(sequelize);
exports.questionTypes = {

  // Fetch question types allowed to be used by the client from the database
  find: function(params, callback) {
    sequelize.transaction(function() {
      return questionTypeModel.findAll()
        .then(function(data) {
          return callback(null, data);
        }, function(error) {
          return callback(error, null);
        });
    });
  }
};

// Definition of question event model for QuestionEvent table in NEMO Datamart
var questionEventModel = require('./models/QuestionEvent')(sequelize);
exports.questionEvents = {

  // Fetch question events allowed to be used by the client from the database
  find: function(params, callback) {
    sequelize.transaction(function() {
      return questionEventModel.findAll()
        .then(function(data) {
          return callback(null, data);
        }, function(error) {
          return callback(error, null);
        });
    });
  }
};
