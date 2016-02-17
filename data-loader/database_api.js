/* jshint undef: true, unused: false */

var sequelize = require('sequelize');
var fs = require('fs');

var data = fs.readFileSync('./dataLoaderConfig.json'),
	dataLoaderOptions;

try {
	dataLoaderOptions = JSON.parse(data);
} catch (err) {
	console.log('There has been an error parsing your JSON.');
	console.log(err);
}

var Sequelize = new sequelize(dataLoaderOptions.nemoConnection.dbName,
	dataLoaderOptions.nemoConnection.userName, dataLoaderOptions.nemoConnection
	.password, dataLoaderOptions.nemoConnection.sequelizeOptions);


// Load the models
var questionModel = require('./models/NEMO/Question')(
	Sequelize);

var questionParameterModel = require('./models/NEMO/QuestionParameter')(
	Sequelize);

var questionStatusModel = require('./models/NEMO/QuestionStatus')(
	Sequelize);

var questionTypeModel = require('./models/NEMO/QuestionType')(
	Sequelize);

var questionEventModel = require('./models/NEMO/QuestionEvent')(
	Sequelize);

var aiModelModel = require('./models/NEMO/AIModel')(
	Sequelize);

var aiParameterModel = require('./models/NEMO/AIParameter')(
	Sequelize);

var parameterTypeModel = require('./models/NEMO/ParameterType')(
	Sequelize);

//
// var userModel = require('./models/NEMO/User')(
// 	Sequelize);
//
// var userPrivilegeModel = require('./models/NEMO/UserPrivilege')(
// 	Sequelize);
//
// var userTypeModel = require('./models/NEMO/UserType')(
// 	Sequelize);
//

// Define associations
questionModel.hasMany(questionParameterModel);
questionModel.hasMany(aiModelModel);
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
aiModelModel.hasMany(aiParameterModel);

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
			ID: 19,
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

	Needs a check added to detect if this exact question has been created yet, as per requirements
*/
function createQuestion(params, callBack) {
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
	Sequelize.transaction(function(t) {
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
						TypeID: pArray[i].TypeID,
						tval_char: pArray[i].tval_char,
						nval_num: pArray[i].nval_num,
						upper_bound: pArray[i].upper_bound
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
		return questionID;
	}).catch(function(error) {
		return callBack(error, null);
	});
}
/* Edit Question:
	Takes attributes of question and parameters of question in object format
	ID is specified for the Question, but optional for parameters, since paramters may be added or updated (upsert)
	Parameter layout is very similar to createQuestion, since a hard edit in the web client will be calling createQuestion,
	and a soft edit in the web client will ball editQuestion
	callBack is used to return data or errors/exceptions
	Example params object:
	var param = {
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
function editQuestion(params, callBack) {
	var questionAttributes = {
		ID: params.ID,
		UserID: params.UserID,
		StatusID: params.QuestionStatusID,
		TypeID: params.QuestionTypeID,
		EventID: params.QuestionEventID
	};
	// Initiate transaction, will be committed if things go smoothly or rolled back if there is an issue at any point
	// Example params object:

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
							QuestionID: params.ID,
							TypeID: pArray[i].TypeID,
							tval_char: pArray[i].tval_char,
							nval_num: pArray[i].nval_num,
							upper_bound: pArray[i].upper_bound
						};
					} else { //If adding a new parameter, omit ID so the ID will be created by the database
						questionParamData = {
							QuestionID: params.ID,
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
			return recurseParam(params.QuestionParamsArray, 0);
		});
	}).then(function(data) {
		return callBack(null, data);
	}).catch(function(error) {
		return callBack(error, null);
	});
}

/* Delete Question:
		Completely deletes a Question from the Question table, as well as its dependent tables
		callBack is used to return data or errors/exceptions
	  Example params object:
		{
		 	ID: 19
		}

		Change from initial requirements, AI Model data is no longer kept
*/
function deleteQuestion(params, callBack) {
	// Initiate transaction, will be committed if things go smoothly or rolled back if there is an issue at any point
	Sequelize.transaction(function(t) {
		// Destroy parameters of question then
		// Destroy parameters of AI models then
		// Destroy AI models of question then
		// Destroy the question itself

		return questionParameterModel.destroy({
			where: {
				QuestionID: params.ID
			}
		}).then(function() {
			// Get list of AI Model IDs to destroy
			return aiModelModel.findAll({
				where: {
					QuestionID: params.ID
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
							ID: params.ID,
						}
					});
				});
			});
		});
	}).then(function(data) {
		return callBack(null, data);
	}).catch(function(error) {
		return callBack(error, null);
	});
}

/* Get Questions by user:
		Get a list of all the Questions for a particular user
		Get the user ID from the web client
		Query the database for all corresponding questions.
		Retrieve additional info for each question
			For each question, get all of the corresponding parameters
			For each question, get the question type
			For each question, get the question event type
			For each question, get the question status
			For each question, get all of the AI Model data
  	callBack is used to return data or errors/exceptions
		Example params object:
		{
		 	UserID: 1,
			orderColumn: 'ID', 	//This is optional, it is the column from the Question table by which to order the questions,
			order: 'DESC',			//This is optional, its the order by which to organize the results, ascending or descending
			start: 0,						//This is optional, used for paging results
			chunk: 10, 					//This is optional, used for limiting amount of the paged results returned
		}

		May need AI Parameter data in the future

*/
function getQuestionsByUser(params, callBack) {
	callBack = callBack;
	var orderColumn = 'ID' || params.orderColumn;
	var order = 'DESC' || params.order;
	var offset = null || params.start;
	var limit = null || params.chunk;
	Sequelize.transaction(function() {
		var userID = params.UserID;
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
		}).then(function(data) {
			return callBack(null, data);
		}).catch(function(error) {
			return callBack(error, null);
		});
	});
}

/* Get Dashboard Questions:
		Get a list of all the Questions in the NEMO Datamart
		query the question database for all corresponding questions.
		Retrieve additional info for each question
			For each question, get all of the corresponding parameters
			For each question, get the question type
			For each question, get the question event type
			For each question, get the question status
			For each question, get all of the AI Model data
  	callBack is used to return data or errors/exceptions
		Example params object:
		{
		 	UserID: 1,
			orderColumn: 'ID', 	//This is optional, it is the column from the Question table by which to order the questions,
			order: 'DESC',			//This is optional, its the order by which to organize the results, ascending or descending
			start: 0,						//This is NOT optional, used for paging results
			chunk: 10, 					//This is NOT optional, used for limiting amount of the paged results returned
		}

		May need AI Parameter data in the future

*/
function getDashboardQuestions(params, callBack) {
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
		}).then(function(data) {
			return callBack(null, data);
		}).catch(function(error) {
			return callBack(error, null);
		});
	});
}

function getParameterTypes(params, callBack) {
	callBack = callBack;
	Sequelize.transaction(function() {
		return parameterTypeModel.findAll().then(function(data) {
			console.log(data);
		});
	});
}

var getQuestionTypes = function(params, callback) {
	sequelize.transaction(function() {
		return questionTypeModel.findAll()
			.then(function(data) {
				return callback(null, data);
			}, function(error) {
				return callback(error, null);
			});
	});
};

var getQuestionEvents = function(params, callback) {
	sequelize.transaction(function() {
		return questionEventModel.findAll()
			.then(function(data) {
				return callback(null, data);
			}, function(error) {
				return callback(error, null);
			});
	});
};

var getQuestionStatus = function(params, callback) {
	sequelize.transaction(function() {
		return questionStatusModel.findAll()
			.then(function(data) {
				return callback(null, data);
			}, function(error) {
				return callback(error, null);
			});
	});
};

/* Copy question:
		receive the question ID from the web client.
		query the datamart for the corresponding question entry
		change the entries of the question:
			- user name
			- question ID (create a new ID)
			- status
		submit the new question entry
		query the parameter table for all entries under the question ID
		change the entries of the tables, adding in the newly created question ID
		submit the new parameter entries
		*/
function copyQuestion(params, callback) {
	Sequelize.transaction(function(t) {
		var id = params.ID;
		var use_ai_models = params.use_ai_models;
		var new_question;
		return questionModel.findById(id).then(function(old_question) {
			new_question = {
				UserID: params.UserID,
				QuestionTypeID: old_question.TypeID,
				QuestionStatusID: old_question.StatusID,
				QuestionEventID: old_question.EventID
			};
			return questionParameterModel.findAll({
				where: {
					QuestionID: id
				}
			}).then(function(old_params) {
				new_question.QuestionParamsArray = [];
				for (var i = 0; i < old_params.length; i++) {
					new_question.QuestionParamsArray.push({
						TypeID: old_params[i].dataValues.TypeID,
						tval_char: old_params[i].dataValues.tval_char,
						nval_num: old_params[i].dataValues.nval_num,
						upper_bound: old_params[i].dataValues.upper_bound
					});
				}
				var new_id = createQuestion(new_question, callback);
				if (use_ai_models) {
					return aiModelModel.findAll({
						where: {
							QuestionID: id
						}
					}).then(function(old_ai_models) {
						var recurseAiModel = function(mArray, i) {
							if (mArray[i]) {
								return aiModelModel.create({
									QuestionID: new_id,
									Value: mArray[i].dataValues.Value,
									Accuracy: mArray[i].dataValues.Accuracy,
									AIFeedback: mArray[i].dataValues.AIFeedback,
									PredictionFeedback: mArray[i].dataValues.PredictionFeedback,
									AI: mArray[i].dataValues.AI,
									Active: mArray[i].dataValues.Active
								}, {
									transaction: t
								}).then(function(new_ai_model) {
									var ai_model_id = data.dataValues.ID;
									return aiParameterModel.findAll({
										where: {
											AIModelID: mArray[i].dataValues.ID
										}
									}).then(function(old_ai_parameters) {
										var recurseAiParameter = function(pArray, i) {
											if (pArray[i]) {
												return aiParameterModel.create({
													AIModelID: ai_model_id,
													TypeID: pArray[i].dataValues.TypeID,
													tval_char: pArray[i].dataValues.tval_char,
													nval_num: pArray[i].dataValues.nval_num
												}, {
													transaction: t
												}).then(recurseAiParameter(pArray, (i + 1)));
											}
										};
										return recurseAiParameter(old_ai_parameters, 0);
									});
								});
							}
						};
						return recurseAiModel(old_ai_models, 0);


					});
				}

			});

		});
	});
}
