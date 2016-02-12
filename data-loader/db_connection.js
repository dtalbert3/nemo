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

// Define models for NEMO connection, annoying...wish I knew a way around this
var observation_fact_nemo = require('./models/KUMC/observation_fact')(dataMartCon);
var patient_dimension_nemo = require('./models/KUMC/patient_dimension')(dataMartCon);
var concept_dimension_nemo = require('./models/KUMC/concept_dimension')(dataMartCon);
var visit_dimension_nemo = require('./models/KUMC/visit_dimension')(dataMartCon);
var provider_dimension_nemo = require('./models/KUMC/provider_dimension')(dataMartCon);
var code_lookup_nemo = require('./models/KUMC/code_lookup')(dataMartCon);
var observation_fact_kumc = require('./models/KUMC/observation_fact')(kumcCon);
var patient_dimension_kumc = require('./models/KUMC/patient_dimension')(kumcCon);
var concept_dimension_kumc = require('./models/KUMC/concept_dimension')(kumcCon);
var visit_dimension_kumc = require('./models/KUMC/visit_dimension')(kumcCon);
var provider_dimension_kumc = require('./models/KUMC/provider_dimension')(kumcCon);
var code_lookup_kumc = require('./models/KUMC/code_lookup')(kumcCon);



// This function breaks the table into chunks and copies them from the source postgres DB to the target DB
var copyTable = function(start, chunk, sourceModel, destModel, orderColumn) {
  sourceModel.findAll({ offset: start, limit: chunk, order: [[orderColumn, 'DESC']], ignoreDuplicates:true })
    .then(function(rows) {
      // Split selection into chunks, and insert them into NEMO Datamart
      // Function to extract dataValues for insertion into target DB
      console.log('Start: ', start );
      console.log(sourceModel.tableName);
      var result = rows.map(function(a) {return a.dataValues;});
      if(result.length > 0){
        destModel.bulkCreate(result).then(copyTable((start + chunk), chunk, sourceModel, destModel, orderColumn)).error(function(err) {
        //destModel.bulkCreate(result, {updateOnDuplicate: true}).then(copyTable((start + chunk), chunk, sourceModel, destModel)).error(function(err) {
        console.log(err);}).catch(function(reason){console.log(reason);});
      }
    });
};

// Copy all the I2B2 tables
copyTable(0, 2048, patient_dimension_kumc, patient_dimension_nemo, 'patient_num');
copyTable(0, 2048, observation_fact_kumc, observation_fact_nemo, 'encounter_num');
copyTable(0, 2048, concept_dimension_kumc, concept_dimension_nemo, 'concept_path');
copyTable(0, 2048, visit_dimension_kumc, visit_dimension_nemo, 'encounter_num');
copyTable(0, 2048, provider_dimension_kumc, provider_dimension_nemo, 'provider_id');
copyTable(0, 2048, code_lookup_kumc, code_lookup_nemo, 'table_cd');
