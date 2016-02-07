var Sequelize = require('sequelize')
var kumcCon = new Sequelize('KUMC', 'username', 'password', {
  host: 'url/to/kumc',
  dialect: 'postgres',
  port: 5432

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
});

var dataMartCon = new Sequelize('NEMO_Datamart', 'username', 'password', {
	host: 'codyemoffitt.com',
	dialect: 'mysql',
	
	pool: {
		max: 5
		min: 0,
		idle: 10000
	},
});

dataMartCon.query("SELECT patient_num FROM LearnerPatient", {type: sequelize.QueryTypes.SELECT}).then(function(learner_patients) {})

kumcCon.query("SELECT * FROM observation_fact WHERE patient_num=?", {replacements: learner_patients, type: sequelize.QueryTypes.SELECT}).then(function(learner_obs) {
})

dataMartCon.query("SELECT patient_num FROM TestPatient", {type: sequelize.QueryTypes.SELECT}).then(function(test_patients) {})


kumcCon.query("SELECT * FROM observation_fact WHERE patient_num=?", {replacements: test_patients, type: sequelize.QueryTypes.SELECT}).then(function(test_obs) {
})

// Now that data entries are inside the arrays, they need to be put into the tables on the dataMart. Not sure how to do that.
// Also, need to do the same thing here with the concept_dimension, provider_dimension, and maybe code_lookup tables. 

