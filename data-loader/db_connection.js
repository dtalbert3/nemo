var sequelize = require('sequelize');
var kumcCon = new sequelize('KUMC_NEMO', 'NEMO_WEB', 'NEMO', {
  host: 'codyemoffitt.com',
  dialect: 'postgres',
  port: 5432,
  logging: false,
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

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

//Load models
//Had to assing DataTypes to sequelize for the auto generated model

//Attributes in an object, since I use it for each connection.

// Define models for each connection, annoying...wish I knew a way around this
// var observation_fact_kumc = require('./models/KUMC/observation_fact')(kumcCon);
var observation_fact_nemo = require('./models/KUMC/observation_fact')(dataMartCon);




//Models for learner and test patients

// var learnerPatients = dataMartCon.define('LearnerPatients', {
//     patient_num: {
//       type: sequelize.INTEGER(11),
//       allowNull: false,
//       primaryKey: true,
//       references: {
//         model: '',
//         key: ''
//       }
//     }
//   }, {
//     tableName: 'LearnerPatients',
//     freezeTableName: true,
//     timestamps: false
//   });
//
// var testPatients = dataMartCon.define('TestPatients', {
//     patient_num: {
//       type: sequelize.INTEGER(11),
//       allowNull: false,
//       primaryKey: true,
//       references: {
//         model: '',
//         key: ''
//       }
//     }
//   }, {
//     tableName: 'TestPatients',
//     freezeTableName: true,
//     timestamps: false
//   });

// var dividePatients = function(){
//   var learnerPatient = false;
//   patient_dimension_nemo.findAll().then(function(patients){
//     for(var patient in patients){
//       if(learnerPatient){
//         learnerPatients.upsert({patient_num: patient.dataValues.patient_num});
//       }
//       else{
//         testPatients.upsert({patient_num: patient.dataValues.patient_num});
//       }
//
//       learnerPatient = !learnerPatient;
//     }
//   });
// };

// This fails, packet is too large. Need to split
var copyObservationFacts = function(start, chunk) {
  var query = 'SELECT encounter_num, patient_num, concept_cd, provider_id, start_date, modifier_cd, instance_num, valtype_cd, tval_char, nval_num, valueflag_cd, quantity_num, units_cd, end_date, location_cd, observation_blob, confidence_num, update_date, download_date, import_date, sourcesystem_cd, upload_id, text_search_index FROM observation_fact ORDER BY patient_num LIMIT ' + chunk + ' OFFSET ' + start + ';';
  kumcCon.query(query, { type: sequelize.QueryTypes.SELECT})
    .then(function(observations) {
      //Split observations into chunks, and insert them into NEMO Datamart
      // var i,j,tempArray,chunk = 2048;
      // j=observations.length;
      // console.log('j = ', j);
      // for (i=0; i<j; i+=chunk)
      // {
      //   tempArray = observations.slice(i,i+chunk);
      //   observation_fact_nemo.bulkCreate(tempArray);
      //   console.log('Chunk i = ', i);
      // }
      console.log('Start: ', start);
      console.log('End:', start + chunk);
      if(observations.length > 1){
        observation_fact_nemo.bulkCreate(observations).done(copyObservationFacts((start + chunk), chunk));
      }
    });
};

copyObservationFacts(0, 2048);

// Now that data entries are inside the arrays, they need to be put into the tables on the dataMart. Not sure how to do that.
// Also, need to do the same thing here with the concept_dimension, provider_dimension, and maybe code_lookup tables.
