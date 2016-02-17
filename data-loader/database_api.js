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

function createQuestion(params, callBack) {
	callBack = callBack;
	var questionAttributes = {
		UserID: params.UserID,
		StatusID: params.QuestionStatusID,
		TypeID: params.QuestionTypeID,
		EventID: params.QuestionEventID
	};
	Sequelize.transaction(function(t) {

		return questionModel.create(questionAttributes, {
			transaction: t
		}).then(function(data) {
			var questionID = data.dataValues.ID;
			// Recursively chain questionParameter create promises
			var recurseParam = function(pArray, i) {
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
			return recurseParam(params.QuestionParamsArray, 0);
		});
	});
}
/* Edit Question:
		Would work the same ways as a copy question, except that the original is deleted afterwards
		Get the question ID from the web client
		query the database for the corresponding question entry
*/
function editQuestion(params, callBack) {
	callBack = callBack;
	var questionAttributes = {
		ID: params.ID,
		UserID: params.UserID,
		StatusID: params.QuestionStatusID,
		TypeID: params.QuestionTypeID,
		EventID: params.QuestionEventID
	};
	Sequelize.transaction(function(t) {

		return questionModel.upsert(questionAttributes, {
			transaction: t
		}).then(function() { // Recursively chain questionParameter upsert promises
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
			return recurseParam(params.QuestionParamsArray, 0);
		});
	});
}

/* Edit Question:
		Would work the same ways as a copy question, except that the original is deleted afterwards
		Get the question ID from the web client
		query the database for the corresponding question entry
*/
function deleteQuestion(params, callBack) {
	callBack = callBack;

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
	});
}

/* Get Questions by user:
		Get the user ID from the web client
		query the question database for all corresponding questions.
		Retreive additional info for each question
			for each question, get all of the corresponding parameters
			for each question, get the question type
			for each question, get the event type
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
				required: true
			}, {
				model: questionTypeModel,
				required: true
			}, {
				model: questionEventModel,
				required: true
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
			console.log(data);
		});
	});
}

function getDashboardQuestions(params, callBack) {
	callBack = callBack;
	var orderColumn = 'UserID' || params.orderColumn;
	var order = 'DESC' || params.order;
	Sequelize.transaction(function() {
		return questionModel.findAll({
			include: [questionParameterModel, aiModelModel, {
				model: questionStatusModel,
				required: true
			}, {
				model: questionTypeModel,
				required: true
			}, {
				model: questionEventModel,
				required: true
			}],
			offset: params.start,
			limit: params.chunk,
			order: [
				[orderColumn, order]
			]
		}).then(function(data) {
			console.log(data);
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

// deleteQuestion({
// 	ID: 19
// }, null);

// getQuestionsByUser({
// 	UserID: 1
// }, null);

// getQuestionsByUser({
//
// 	UserID: 1
// }, null);
//
// getDashboardQuestions({
// 	start: 0,
// 	chunk: 2
// }, null);
//
// getParameterTypes(null, null);

// var param = {
// 	ID: 18,
// 	UserID: 1,
// 	QuestionStatusID: 2,
// 	QuestionTypeID: 1,
// 	QuestionEventID: 1,
// 	QuestionParamsArray: [{
// 		ID: 19,
// 		TypeID: 1,
// 		tval_char: 'Edited parameter 1 Some data',
// 		nval_num: 7777,
// 		upper_bound: 0
// 	}, {
// 		ID: 20,
// 		TypeID: 1,
// 		tval_char: 'Edited Parameter 2 Some more data',
// 		nval_num: 7788,
// 		upper_bound: 1
// 	}, {
// 		TypeID: 1,
// 		tval_char: 'Added Parameter 3 On Edit',
// 		nval_num: 123,
// 		upper_bound: 1
// 	}]
// };

function copyQuestion(params, callback) {
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
	/*
	Sequelize.transaction(function(t){
		var id = params.ID;
		var use_ai_models = params.use_ai_models;
		var new_question;
		return questionModel.findByID(id, {
			transaction: t
		}).then(function(old_question) {
			new_question = {
				UserID: old_question.UserID,
				TypeID: old_question.TypeID,
				StatusID: old_question.StatusID,
				EventID: old_question.StatusID
			};
		});
		return questionParameterModel.findAll({
			where: {
				QuestionID: id
			}, {
				transaction: t
			}).then(function(old_params) {
				for (var i = 0; i < old_params.length; i++) {
					new_question.QuestionParamsArray.push({
						TypeID: old_params[i].dataValues.TypeID,
						tval_char: old_params[i].dataValues.tval_char,
						nval_num: old_params[i].dataValues.nval_num,
						upper_bound: old_params[i].dataValues.upper_bound
					});
				}
			});
		};
		createQuestion(new_question, callback);
		if (use_ai_models) {

		}
	});
	*/
	/*
 	var query = 'SELECT ID, TypeID, EventID FROM Question WHERE ID=' +
 		question_id + ';';
 	dataMartCon.query(query, {
 			type: sequelize.QueryTypes.SELECT
 		})
 		.then(function(old_question) {
 				old_question = old_question;
 				// Somehow construct a submit statement to insert the new fields into the old question.
 				// The question needs to be added first, before moving on to the parameters.
 				query =
 					'SELECT Name, concept_path, concept_cd, valtype_cd, TableName, TableColumn from ParamaterType WHERE ID=' +
 					question_id + ';';

 				// dataMartCon.query(query, {
 				// 		type: sequelize.QueryTypes.SELECT
 				// 	})
 				// 	.then(function(parameters) {
 				// 			parameter = parameter;
 				// 			// Create new parameters from the old ones, fitting them with the new question ID
 				// 			/*
 				// 			for(var i = 0; i < parameters.length; i++) {
 				// 				parameters[i].ID = getNewID();
 				// 			}
 				// 			query = 'INSERT parameters=? INTO ParameterType;'
 				// 			dataMartCon.*/
 				// 		}


 	// 				);
 	// 		}
		//
		//
 	// 	);
		// */
}

// var deleteQuestion = function(question_id) {
// 	/* Delete question:
// 			receive the question ID from the web client.
// 			remove all entries from the parameter table with the question ID
// 			remove the question with the corresponding ID
// 			*/
// 	var dataMartCon = new sequelize('NEMO_Datamart', 'NEMO_WEB', 'NEMO', {
// 		host: 'codyemoffitt.com',
// 		dialect: 'mysql',
// 		port: 3306,
// 		logging: false,
// 		pool: {
// 			max: 5,
// 			min: 0,
// 			idle: 10000
// 		}
// 	});
//
// 	var query = 'DELETE from Question WHERE ID=' + question_id + ';';
// 	dataMartCon.query(query, {
// 			type: sequelize.QueryTypes.DELETE
// 		})
// 		.then(function() {
// 			var query = 'DELETE from QuestionParameter WHERE ID=' + question_id +
// 				';';
// 			dataMartCon.query(query, {
// 					type: sequelize.QueryTypes.DELETE
// 				})
// 				.then(function() {});
// 		});
// };
