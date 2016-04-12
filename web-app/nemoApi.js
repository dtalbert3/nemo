var Sequelize = require('sequelize');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
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
var aiModelParamsModel = require('./models/AIModelParams')(sequelize);
// var parameterTypeModel = require('./models/ParameterType')(sequelize);

var conceptModel = require('./models/concept_dimension')(sequelize);

// Define associations
questionModel.hasMany(questionParameterModel);
questionModel.hasMany(aiModelModel);
aiModelModel.hasMany(aiParameterModel);

// questionStatusModel.hasMany(questionModel);
questionModel.belongsTo(questionStatusModel, {
  foreignKey: 'StatusID'
});
questionModel.belongsTo(questionTypeModel, {
  foreignKey: 'TypeID'
});
questionModel.belongsTo(questionEventModel, {
  foreignKey: 'EventID'
});

exports.hooks = {
  auth(socket) {
    console.log('authed');
    return socket;
  }
};

exports.authService = function(socket, hooks) {
  hooks = (typeof hooks !== 'undefined') ? hooks : [];

  // Authenticate user
  socket.on('local', function(params, callback) {
    hooks.forEach(function(func) {
      func(socket);
    });
    var error = 'Invalid Password/Username';
    var result = null;
    userModel.findOne({
      where: {
        email: params.email
      }
    }).then(function(data) {
      // If user exists validate password
      if (data !== null) {
        if (bcrypt.compareSync(params.password, data.dataValues.Hash)) {
          var user = {
            email: data.dataValues.Email,
            userType: data.dataValues.UserTypeID,
            ID: data.dataValues.ID
          };
          error = null;
          result = jwt.sign(user, config.session.secret, {
            expiresIn: 60 * 1000
          });
        }
      }
      return callback(error, result);
    }, function() {
      return callback(error, result);
    });
  });

};

exports.userService = function(socket, hooks) {
  hooks = (typeof hooks !== 'undefined') ? hooks : [];

  // Sign user up
  socket.on('signup', function(data, callback) {
    hooks.forEach(function(func) {
      func(socket);
    });
    data.first = "Cody";
    data.last = "Moffitt";
    data.affiliation = "MTSU";
    
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(data.password, salt, function(err, hash) {
        // SWITCH TO FIND OR CREATE!!
        bcrypt.hash(data.email, salt, function(err2, hash2) {
        userModel.upsert({
          UserTypeID: 1,
          Email: data.email,
          Hash: hash,
          First: data.first,
          Last:  data.last,
          Affiliation: data.affiliation,
          Confirmed: 0,
          ConfirmationHash: hash2
        })
        .then(function(data) {
          // Return error codes as needed here
          return callback(null, data);
        }, function(error) {
          return callback(error, null);
        }); });
      });
    });
  });

};

exports.questionService = function(socket, hooks) {
  hooks = (typeof hooks !== 'undefined') ? hooks : [];

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
  socket.on('create', function(params, callback) {
    hooks.forEach(function(func) {
      func(socket);
    });

    // Compile a question attributes for upsert
    var questionAttributes = {
      UserID: params.UserID,
      StatusID: params.QuestionStatusID,
      TypeID: params.QuestionTypeID,
      EventID: params.QuestionEventID
    };
    // Declare questionID for use later
    var questionID;
    // Initiate transaction, will be committed if things go smoothly or rolled back if there is an issue at any point
    sequelize.transaction(function(t) {
      return questionModel.create(questionAttributes, {
        transaction: t
      }).then(function(data) {
        // QuestionID is needed as a foreign key for QuestionParameter
        questionID = data.dataValues.ID;
        // Helper function to recursively chain questionParameter create promises
        var recurseParam = function(pArray, i) {
          // If the current parameter exists only, otherwise nothing is done and promise chain is ended
          if (pArray[i]) {
            return questionParameterModel.create({
              QuestionID: questionID,
              //TypeID: pArray[i].TypeID,
              tval_char: pArray[i].tval_char,
              nval_num: pArray[i].nval_num,
              //upper_bound: pArray[i].upper_bound,
              // Name: pArray[i].Name,
              concept_path: pArray[i].concept_path,
              concept_cd: pArray[i].concept_cd,
              valtype_cd: pArray[i].valtype_cd,
              TableName: pArray[i].TableName,
              TableColumn: pArray[i].TableColumn,
              min: pArray[i].min,
              max: pArray[i].max
            }, {
              transaction: t
            }).then(recurseParam(pArray, (i + 1)));
          }
        };
        // Call helper function to insert Question Parameters
        return recurseParam(params.QuestionParamsArray, 0);
      });
    }).then(function() {
      // Return the Question ID of the created question
      return callback(null, questionID);
    }).catch(function(error) {
      return callback(error, null);
    });
  });

  // Fetch parameters allowed to be used by client from database
  socket.on('getSuggestions', function(callback) {
    hooks.forEach(function(func) {
      func(socket);
    });
    sequelize.transaction(function() {
      // return parameterTypeModel.findAll() OLD CODE
      return conceptModel.findAll({
        attributes: ['concept_cd'],
        where: {
          concept_cd: {
            $or: [{
              $like: 'ICD9:%'
            }, {
              $like: 'LOINC:%'
            }]
          }
        }
      })
      .then(function(data) {
        return callback(null, data);
      }, function(error) {
        return callback(error, null);
      });
    });
  });

  // Fetch question types allowed to be used by the client from the database
  socket.on('getTypes', function(callback) {
    hooks.forEach(function(func) {
      func(socket);
    });
    sequelize.transaction(function() {
      return questionTypeModel.findAll()
        .then(function(data) {
          return callback(null, data);
        }, function(error) {
          return callback(error, null);
        });
    });
  });

  // Fetch question events allowed to be used by the client from the database
  socket.on('getEvents', function(callback) {
    hooks.forEach(function(func) {
      func(socket);
    });
    sequelize.transaction(function() {
      return questionEventModel.findAll()
        .then(function(data) {
          return callback(null, data);
        }, function(error) {
          return callback(error, null);
        });
    });
  });

};

exports.dashboardService = function(socket, hooks) {
  hooks = (typeof hooks !== 'undefined') ? hooks : [];

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
  socket.on('getGlobal', function(params, callback) {
    hooks.forEach(function(func) {
      func(socket);
    });
    var orderColumn = 'UserID' || params.orderColumn;
    var order = 'DESC' || params.order;
    sequelize.transaction(function() {
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
  socket.on('getUser', function(id, params, callback) {
    hooks.forEach(function(func) {
      func(socket);
    });
    var orderColumn = 'ID' || params.orderColumn;
    var order = 'DESC' || params.order;
    var offset = null || params.start;
    var limit = null || params.chunk;
    sequelize.transaction(function() {
      var userID = id;
      return questionModel.findAll({
        include: [questionParameterModel, {
          model: aiModelModel,
          order: [['DateModified', 'DESC']],
          limit: 1
        }, {
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
        return callback(null, JSON.stringify(d));
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
  socket.on('find', function(id, data, params, callback) {
    hooks.forEach(function(func) {
      func(socket);
    });
    var questionAttributes = {
      ID: data.ID,
      UserID: data.UserID,
      StatusID: data.QuestionStatusID,
      TypeID: data.QuestionTypeID,
      EventID: data.QuestionEventID
    };
    // Initiate transaction, will be committed if things go smoothly or rolled back if there is an issue at any point
    // Example data object:

    sequelize.transaction(function(t) {
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
            return questionParameterModel.upsert(
              questionParamData, {
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
  socket.on('delete', function(id, callback) {
    sequelize.transaction(function(t) {
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
  				// Find all of the AI Model Parameters
  				return aiModelParamsModel.findAll({
  					where: {
  						AIModel: {
  							$in: aiModelDataIDList
  						}
  					}
  				}).then(function(aiModelParamsData) {
  					var aiModelParamsList = aiModelParamsData.map(function(b) {
  						return b.dataValues.AIModel;
  					});
  					// Destroy all of the AI model parameters
  					return aiModelParamsModel.destroy({
  						where: {
  							AIModel: {
  								$in: aiModelParamsList
  							}
  						}
  					}).then(function() {
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
  									ID: id,
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
  	});
  });

  socket.on('feedback', function(params, callback) {
    var val = params.value;
    var id = params.aiModelID;
    sequelize.transaction(function(t) {
      return aiModelModel.findById(id)
      .then(function(aiModel) {
        var updatedAiModel = {
          ID: aiModel.ID,
          QuestionID: aiModel.QuestionID,
          Value: aiModel.Value,
          Accuracy: aiModel.Accuracy,
          AIFeedback: val,
          PredictionFeedback: aiModel.PredictionFeedback,
          AI: aiModel.AI,
          Algorithm: aiModel.Algorithm,
          Active: aiModel.Active,
          DateModified: aiModel.DateModified,
					ConfusionMatrix: aiModel.ConfusionMatrix
        };
        return aiModelModel.upsert(updatedAiModel, {
          transaction: t
        }).then(function() {
          var qid = aiModel.QuestionID;
          return questionModel.findById(qid)
            .then(function(question) {
              var updatedQuestion = {
                ID: question.ID,
                UserID: question.UserID,
                StatusID: 1,
                EventID: question.EventID,
                TypeID: question.TypeID
              };
              return questionModel.upsert(updatedQuestion, {
                transaction: t
              });
          });
        });
      });
    })
    .then(function(data) {
      return callback(null, 'success');
    })
    .catch(function(error) {
      return callback(error, null);
    });
  });
};
