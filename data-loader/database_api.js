var sequelize = require('sequelize');
// var fs = require('fs');
// // var Promise = require('promise');
//
// var data = fs.readFileSync('./dataLoaderConfig.json'),
// 	dataLoaderOptions;
//
// var Sequelize = new sequelize(dataLoaderOptions.nemoConnection.dbName,
// 	dataLoaderOptions.nemoConnection.userName, dataLoaderOptions.nemoConnection
// 	.password, dataLoaderOptions.nemoConnection.sequelizeOptions);
// try {
// 	dataLoaderOptions = JSON.parse(data);
// } catch (err) {
// 	console.log('There has been an error parsing your JSON.');
// 	console.log(err);
// }

// // Load the models
// var questionModel = require('./models/NEMO/Question')(
// 	Sequelize);
//
// var questionParameterModel = require('./models/NEMO/QuestionParameter')(
// 	Sequelize);
//
// var questionStatusModel = require('./models/NEMO/QuestionStatus')(
// 	Sequelize);
//
// var questionTypeModel = require('./models/NEMO/QuestionType')(
// 	Sequelize);
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
// var aiModelModel = require('./models/NEMO/AIModel')(
// 	Sequelize);
// var aiParameterModel = require('./models/NEMO/AIParameter')(
// 	Sequelize);
//
// var createQuestion = function(params, callBack) {
//
// 	var questionAttributes = {
// 		UserID: params.UserID,
// 		StatusID: params.QuestionStatusID,
// 		TypeID: params.QuestionTypeID,
// 		EventID: params.QuestionEventID
// 	};
// 	questionModel.upsert(questionAttributes);
//
// 	questionModel.findOne({
// 		where: questionAttributes
// 	}).done(function(question) {
// 		for (var parameter in params.QuestionParamsArray) {
// 			questionParameterModel.upsert({
// 				QuestionID: question.dataValues.ID,
// 				TypeID: parameter.TypeID,
// 				tval_char: parameter.tval_char,
// 				nval_num: parameter.nval_num,
//				upper_bound: parameter.upper_bound
// 			});
// 		}
// 	});
// };

var copyQuestion = function(question_id) {
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

	var dataMartCon = new sequelize('NEMO_Datamart', 'NEMO_WEB', 'NEMO', {
		host: 'codyemoffitt.com',
		dialect: 'mysql',
		port: 3306,
		logging: false,
		pool: {
			max: 5,
			min: 0,
			idle: 10000
		}
	});
	var query = 'SELECT ID, TypeID, EventID FROM Question WHERE ID=' +
		question_id + ';';
	dataMartCon.query(query, {
			type: sequelize.QueryTypes.SELECT
		})
		.then(function(old_question) {
				old_question = old_question;
				// Somehow construct a submit statement to insert the new fields into the old question.
				// The question needs to be added first, before moving on to the parameters.
				// var parameter_query = 'SELECT Name, concept_path, concept_cd, valtype_cd, TableName, TableColumn from ParamaterType WHERE ID=' + question_id + ';';

				dataMartCon.query(query, {
						type: sequelize.QueryTypes.SELECT
					})
					.then(function(old_parameters) {
							old_parameters = old_parameters;
							// Create new parameters from the old ones, fitting them with the new question ID
						}


					);
			}


		);
};

var deleteQuestion = function(question_id) {
	/* Delete question:
			receive the question ID from the web client.
			remove all entries from the parameter table with the question ID
			remove the question with the corresponding ID
			*/
	var dataMartCon = new sequelize('NEMO_Datamart', 'NEMO_WEB', 'NEMO', {
		host: 'codyemoffitt.com',
		dialect: 'mysql',
		port: 3306,
		logging: false,
		pool: {
			max: 5,
			min: 0,
			idle: 10000
		}
	});

	var query = 'DELETE from Question WHERE ID=' + question_id + ';';
	dataMartCon.query(query, {
			type: sequelize.QueryTypes.DELETE
		})
		.then(function() {
			var query = 'DELETE from QuestionParameter WHERE ID=' + question_id +
				';';
			dataMartCon.query(query, {
					type: sequelize.QueryTypes.DELETE
				})
				.then(function() {});
		});
};

console.log(copyQuestion);
console.log(deleteQuestion);
/* Edit Question:
		Would work the same ways as a copy question, except that the original is deleted afterwards
		Get the question ID from the web client
		query the database for the corresponding question entry
		*/

/* Get Questions by user:
		Get the user ID from the web client
		query the question database for all corresponding questions.
		Retreive additional info for each question
			for each question, get all of the corresponding parameters
			for each question, get the question type
			for each question, get the event type
		*/
