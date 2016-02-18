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

// List of service calls offered by featherjs
// find: function(params, callback) {},
// get: function(id, params, callback) {},
// create: function(data, params, callback) {},
// update: function(id, data, params, callback) {},
// patch: function(id, data, params, callback) {},
// remove: function(id, params, callback) {},
// setup: function(app, path) {}

var userModel = require('./client/models/user')(sequelize);
// Model really not even required here too :)! Remove later . . .
exports.userService = {

  // Can use this to authenticate
  // We should send back a token to be used upon each request
  // Find query to authenticate user correctly
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
};

var questionModel = require('./models/Question')(sequelize);
var questionParameterModel = require('./models/QuestionParameter')(sequelize);
questionModel.hasMany(questionParameterModel);
exports.questionService = {

  /* Create Question:
  	Takes attributes of question and parameters of question in object format
  	callBack is used to return data or errors/exceptions
  	Example params object:
  	var param = {
  		UserID: 1,
  		QuestionStatusID: 2,
  		QuestionTypeID: 1,
  		QuestionEventID: 1,
  		QuestionParamsArray: [{
  			TypeID: 1,
  			tval_char: 'Some data',
  			nval_num: 7777,
  			upper_bound: 0
  		}, {
  			TypeID: 1,
  			tval_char: 'Some more data',
  			nval_num: 7788,
  			upper_bound: 1
  		}]
  	};
  */

  // NOTE: User authenticate not currently implemented
  // Using 'hard-passed' UserID currently
  create: function(data, params, callback) {
    console.log(data.QuestionParamsArray);
    // Compile a question attributes for upsert
    var questionAttributes = {
      UserID: data.UserID,
      StatusID: data.QuestionStatusID,
      TypeID: data.QuestionTypeID,
      EventID: data.QuestionEventID
    };
    // Declare questionID for use later
    var questionID;
    // Initiate transaction, will be committed if things go smoothly or rolled back if there is an issue at any point
    sequelize.transaction(function(t) {
      return questionModel.create(questionAttributes, {
        transaction: t
      }).then(function(d) {
        // QuestionID is needed as a foreign key for QuestionParameter
        questionID = d.dataValues.ID;
        // Helper function to recursively chain questionParameter create promises
        function recurseParam(pArray, i) {
          console.log(pArray);
          // If the current parameter exists only, otherwise nothing is done and promise chain is ended
          if (pArray[i]) {
            return questionParameterModel.create({
              QuestionID: questionID,
              TypeID: pArray[i].TypeID,
              tval_char: pArray[i].tval_char,
              nval_num: pArray[i].nval_num,
              upper_bound: pArray[i].upper_bound
            }, {
              transaction: t
            }).then(recurseParam(pArray, (i + 1)));
          }
        }
        // Call helper function to insert Question Parameters
        return recurseParam(data.QuestionParamsArray, 0);
      });
    }).then(function() {
      // Return the Question ID of the created question
      return callback(null, '');
    }).catch(function(error) {
      return callback(error, null);
    });
  }
};

exports.dashboardService = {};

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
