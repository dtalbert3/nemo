var Sequelize = require('sequelize');
var bcrypt = require('bcrypt');
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

// apiDoc usage more info at http://apidocjs.com/
/**
 * @api {get} /user/:id Request User information
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {Number} id Users unique ID.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */

// Define models
var userModel = require('./models/User')(sequelize);
var questionModel = require('./models/Question')(sequelize);
var questionParameterModel = require('./models/QuestionParameter')(sequelize);
var questionStatusModel = require('./models/QuestionStatus')(sequelize);
var questionTypeModel = require('./models/QuestionType')(sequelize);
var questionEventModel = require('./models/QuestionEvent')(sequelize);
var aiModelModel = require('./models/AIModel')(sequelize);
var aiParameterModel = require('./models/AIParameter')(sequelize);
var parameterTypeModel = require('./models/ParameterType')(sequelize);

// Define associations
questionModel.hasMany(questionParameterModel);
questionModel.hasMany(questionParameterModel);
questionModel.hasMany(aiModelModel);
aiModelModel.hasMany(aiParameterModel);

// questionStatusModel.hasMany(questionModel);
questionModel.belongsTo(questionStatusModel, { foreignKey: 'StatusID' });
questionModel.belongsTo(questionTypeModel, { foreignKey: 'TypeID' });
questionModel.belongsTo(questionEventModel, { foreignKey: 'EventID' });

exports.userService = function(socket, path) {

  // Authenticate user
  socket.on(path + '::authenticate', function(params, callback) {
    userModel.findOne({
      where: {email: params.email}
    })
    .then(function(data) {
      // If user doesn't exist send back error
      if (data === null) {
        return callback('Invalid Password/Username', null);
      }

      // If user exists validate password
      var user = data.dataValues;
      bcrypt.compare(params.password, user.Hash, function(err, res) {
        if (res) {
          return callback(null, user);
        } else {
          return callback('Invalid Password/Username', null);
        }
      });
    }, function() {
      return callback('Invalid Password/Username', null);
    });
  });

  // Sign user up
  socket.on(path + '::signup', function(data, callback) {
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(data.password, salt, function(err, hash) {
        // SWITCH TO FIND OR CREATE!!
        userModel.upsert({
          UserTypeID: 1,
          Email: data.email,
          Hash: hash
        })
        .then(function(data) {
          return callback(null, data);
        }, function(error) {
          return callback(error, null);
        });
      });
    });
  });

};

exports.questionService = function(socket, path) {

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
  socket.on(path + '::create', function(data, callback) {
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
  });

};

exports.dashboardService = function(socket, path) {

  /* Get Dashboard for global:
  		Get a list of all the Questions in the NEMO Datamart
  		query the question database for all corresponding questions.
  		Retrieve additional info for each question
  			For each question, get all of the corresponding parameters
  			For each question, get the question type
  			For each question, get the question event type
  			For each question, get the question status
  			For each question, get all of the AI Model data
    	callback is used to return data or errors/exceptions
  		Example data object:
  		{
  		 	UserID: 1,
  			orderColumn: 'ID', 	//This is optional, it is the column from the Question table by which to order the questions,
  			order: 'DESC',			//This is optional, its the order by which to organize the results, ascending or descending
  			start: 0,						//This is NOT optional, used for paging results
  			chunk: 10, 					//This is NOT optional, used for limiting amount of the paged results returned
  		}

  		May need AI Parameter data in the future

  */
  socket.on(path + '::create', function(params, callback) {
    var orderColumn = 'UserID' || params.orderColumn;
    var order = 'DESC' || params.order;
    Sequelize.transaction(function() {
      return questionModel.findAll({
        include: [questionParameterModel, aiModelModel, {
          model: questionStatusModel,
          required: true //Inner join
        }, {
          model: questionTypeModel,
          required: true //Inner join
        }, {
          model: questionEventModel,
          required: true //Inner join
        }],
        offset: params.start,
        limit: params.chunk,
        order: [
          [orderColumn, order]
        ]
      }).then(function(d) {
        // Return data to callback
        return callback(null, d);
      }).catch(function(error) {
        // Catch and return errors to callback
        return callback(error, null);
      });
    });
  });

  /* Get Dashboard for user:
  		Get a list of all the Questions for a particular user
  		Get the user ID from the web client
  		Query the database for all corresponding questions.
  		Retrieve additional info for each question
  			For each question, get all of the corresponding parameters
  			For each question, get the question type
  			For each question, get the question event type
  			For each question, get the question status
  			For each question, get all of the AI Model data
    	callback is used to return data or errors/exceptions
  		Example data object:
  		{
  		 	UserID: 1,
  			orderColumn: 'ID', 	//This is optional, it is the column from the Question table by which to order the questions,
  			order: 'DESC',			//This is optional, its the order by which to organize the results, ascending or descending
  			start: 0,						//This is optional, used for paging results
  			chunk: 10, 					//This is optional, used for limiting amount of the paged results returned
  		}

  		May need AI Parameter data in the future

  */
  socket.on(path + '::get', function(id, params, callback) {
    var orderColumn = 'ID' || params.orderColumn;
    var order = 'DESC' || params.order;
    var offset = null || params.start;
    var limit = null || params.chunk;
    Sequelize.transaction(function() {
      var userID = id;
      return questionModel.findAll({
        include: [questionParameterModel, aiModelModel, {
          model: questionStatusModel,
          required: true //Inner join
        }, {
          model: questionTypeModel,
          required: true //Inner join
        }, {
          model: questionEventModel,
          required: true //Inner join
        }],
        offset: offset,
        limit: limit,
        order: [
          [orderColumn, order]
        ],
        where: {
          UserID: userID
        }
      }).then(function(d) {
        // Return data to callback
        return callback(null, d);
      }).catch(function(error) {
        // Catch and return errors to callback
        return callback(error, null);
      });
    });
  });

  /* Edit Dashboard Question:
  	Takes attributes of question and parameters of question in object format
  	ID is specified for the Question, but optional for parameters, since paramters may be added or updated (upsert)
  	Parameter layout is very similar to createQuestion, since a hard edit in the web client will be calling createQuestion,
  	and a soft edit in the web client will call editQuestion. This switching functionality has not yet been implemented.
  	callback is used to return data or errors/exceptions
  	Example params object:
  	var data = {
  		ID: 18,
  		UserID: 1,
  		QuestionStatusID: 2,
  		QuestionTypeID: 1,
  		QuestionEventID: 1,
  		QuestionParamsArray: [{
  			ID: 19,
  			TypeID: 1,
  			tval_char: 'Edited parameter 1 Some data',
  			nval_num: 7777,
  			upper_bound: 0
  		}, {
  			ID: 20,
  			TypeID: 1,
  			tval_char: 'Edited Parameter 2 Some more data',
  			nval_num: 7788,
  			upper_bound: 1
  		}, {
  			TypeID: 1,
  			tval_char: 'Added Parameter 3 On Edit',
  			nval_num: 123,
  			upper_bound: 1
  		}]
  	};
  */
  socket.on(path + '::find', function(id, data, params, callback) {
    var questionAttributes = {
      ID: data.ID,
      UserID: data.UserID,
      StatusID: data.QuestionStatusID,
      TypeID: data.QuestionTypeID,
      EventID: data.QuestionEventID
    };
    // Initiate transaction, will be committed if things go smoothly or rolled back if there is an issue at any point
    // Example data object:

    Sequelize.transaction(function(t) {
      return questionModel.upsert(questionAttributes, {
        transaction: t
      }).then(function() {
        // Helper function to recursively chain questionParameter upsert promises
        var recurseParam = function(pArray, i) {
          if (pArray[i]) {
            var questionParamData;
            // If updating a param, send its ID up
            if (pArray[i].ID) {
              questionParamData = {
                ID: pArray[i].ID,
                QuestionID: data.ID,
                TypeID: pArray[i].TypeID,
                tval_char: pArray[i].tval_char,
                nval_num: pArray[i].nval_num,
                upper_bound: pArray[i].upper_bound
              };
            } else { //If adding a new parameter, omit ID so the ID will be created by the database
              questionParamData = {
                QuestionID: data.ID,
                TypeID: pArray[i].TypeID,
                tval_char: pArray[i].tval_char,
                nval_num: pArray[i].nval_num,
                upper_bound: pArray[i].upper_bound
              };
            }
            return questionParameterModel.upsert(questionParamData, {
              transaction: t
            }).then(recurseParam(pArray, (i + 1)));
          }
        };
        // Call helper function to insert or update Question Parameters
        return recurseParam(data.QuestionParamsArray, 0);
      });
    }).then(function(d) {
      // Return data to callback
      return callback(null, d);
    }).catch(function(error) {
      // Return error to callback
      return callback(error, null);
    });
  });

  /* Delete Dashboard Question:
  		Completely deletes a Question from the Question table, as well as its dependent tables
  		callback is used to return data or errors/exceptions
  	  Example data object:
  		{
  		 	ID: 19
  		}

  		Change from initial requirements, AI Model data is no longer kept
  */
  socket.on(path + '::remove', function(id, params, callback) {
    // Initiate transaction, will be committed if things go smoothly or rolled back if there is an issue at any point
    Sequelize.transaction(function() {
      // Destroy parameters of question then
      // Destroy parameters of AI models then
      // Destroy AI models of question then
      // Destroy the question itself

      return questionParameterModel.destroy({
        where: {
          QuestionID: id
        }
      }).then(function() {
        // Get list of AI Model IDs to destroy
        return aiModelModel.findAll({
          where: {
            QuestionID: id
          }
        }).then(function(aiModelData) {
          var aiModelDataIDList = aiModelData.map(function(a) {
            return a.dataValues.ID;
          });
          //Destroy the AI models
          return aiModelModel.destroy({
            where: {
              ID: {
                $in: aiModelDataIDList
              }
            }
          }).then(function() {
            //Finally delete the question itself
            return questionModel.destroy({
              where: {
                ID: id
              }
            });
          });
        });
      });
    }).then(function(d) {
      // Return data to callback
      return callback(null, d);
    }).catch(function(error) {
      // Return error to callback
      return callback(error, null);
    });
  });

};

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
