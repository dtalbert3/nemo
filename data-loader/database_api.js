var sequelize = reqire('sequelize');
//function createQuestion()

function copyQuestion(int question_id)
{
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
	var dataMartCon = new sequelize('NEMO_Datamart', 'NEMO_WEB', 'NEMO', 
	{
		host: 'codyemoffitt.com',
		dialect: 'mysql',
		port: 3306,
		logging: false,
		pool: 
		{
			max: 5,
			min: 0,
			idle: 10000
		}
	});	
		var query = 'SELECT ID, TypeID, EventID FROM Question WHERE ID=' + question_id + ';';
		kumcCon.query(query, {type:sequelize.QueryTypes.SELECT})
			.then(function(old_question)
			{
				// Somehow construct a submit statement to insert the new fields into the old question. 	
				// The question needs to be added first, before moving on to the parameters.
				var parameter_query = 'SELECT Name, concept_path, concept_cd, valtype_cd, TableName, TableColumn from ParamaterType WHERE ID=' + question_id + ';';
				kumcCon.query(query, {type:sequelize.QueryTypes.SELECT})
				.then(function(old_parameters)
				{
						// Create new parameters from the old ones, fitting them with the new question ID
				}
				 

			}


}

function deleteQuestion(int question_id)
{
	/* Delete question:
			receive the question ID from the web client.
			remove all entries from the parameter table with the question ID
			remove the question with the corresponding ID
			*/
	var dataMartCon = new sequelize('NEMO_Datamart', 'NEMO_WEB', 'NEMO', 
	{
		host: 'codyemoffitt.com',
		dialect: 'mysql',
		port: 3306,
		logging: false,
		pool: 
		{
			max: 5,
			min: 0,
			idle: 10000
		}
	});
	
	var query = 'DELETE from Question WHERE ID=' + question_id + ';';
	kumcCon.query(query {type:sequelize.QueryTypes.DELETE})
	.then(function())
	{
		var query = 'DELETE from QuestionParameter WHERE ID=' + question_id + ';';
		kumcCon.query(query {type:sequelize.QueryTypes.DELETE})
		.then(function(){}
	}
}

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

