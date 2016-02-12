var sequelize = require('sequelize');
var fs = require('fs');
var Promise = require('promise');

var data = fs.readFileSync('./dataLoaderConfig.json'),
  dataLoaderOptions;

try {
  dataLoaderOptions = JSON.parse(data);
  // console.dir(dataLoaderOptions);
} catch (err) {
  console.log('There has been an error parsing your JSON.');
  console.log(err);
}

var kumcCon = new sequelize(dataLoaderOptions.kumcConnection.dbName,
  dataLoaderOptions.kumcConnection.userName, dataLoaderOptions.kumcConnection
  .password, dataLoaderOptions.kumcConnection.sequelizeOptions);
var dataMartCon = new sequelize(dataLoaderOptions.nemoConnection.dbName,
  dataLoaderOptions.nemoConnection.userName, dataLoaderOptions.nemoConnection
  .password, dataLoaderOptions.nemoConnection.sequelizeOptions);

// Define models for NEMO connection, annoying...wish I knew a way around this
var observation_fact_nemo = require('./models/KUMC/observation_fact')(
  dataMartCon);
var patient_dimension_nemo = require('./models/KUMC/patient_dimension')(
  dataMartCon);
var concept_dimension_nemo = require('./models/KUMC/concept_dimension')(
  dataMartCon);
var visit_dimension_nemo = require('./models/KUMC/visit_dimension')(dataMartCon);
var provider_dimension_nemo = require('./models/KUMC/provider_dimension')(
  dataMartCon);
var code_lookup_nemo = require('./models/KUMC/code_lookup')(dataMartCon);
var observation_fact_kumc = require('./models/KUMC/observation_fact')(kumcCon);
var patient_dimension_kumc = require('./models/KUMC/patient_dimension')(kumcCon);
var concept_dimension_kumc = require('./models/KUMC/concept_dimension')(kumcCon);
var visit_dimension_kumc = require('./models/KUMC/visit_dimension')(kumcCon);
var provider_dimension_kumc = require('./models/KUMC/provider_dimension')(
  kumcCon);
var code_lookup_kumc = require('./models/KUMC/code_lookup')(kumcCon);

// Models for sorting into learner or test tables
var learnerPatients = require('./models/NEMO/LearnerPatients')(dataMartCon);
var testPatients = require('./models/NEMO/TestPatients')(dataMartCon);



// This function breaks the table into chunks and copies them from the source postgres DB to the target DB
var copyTable = function(start, chunk, sourceModel, destModel, orderColumn) {
  sourceModel.findAll({
      offset: start,
      limit: chunk,
      order: [
        [orderColumn, 'DESC']
      ],
      ignoreDuplicates: true
    })
    .then(function(rows) {
      // Split selection into chunks, and insert them into NEMO Datamart
      // Function to extract dataValues for insertion into target DB
      console.log('Start: ', start);
      console.log(sourceModel.tableName);
      var result = rows.map(function(a) {
        return a.dataValues;
      });
      if (result.length > 0) {
        destModel.bulkCreate(result).then(copyTable((start + chunk), chunk,
          sourceModel, destModel, orderColumn)).error(function(err) {
          //destModel.bulkCreate(result, {updateOnDuplicate: true}).then(copyTable((start + chunk), chunk, sourceModel, destModel)).error(function(err) {
          console.log(err);
        }).catch(function(reason) {
          console.log(reason);
        });
      }
    });
};

// Copy all the I2B2 tables
if (dataLoaderOptions.tablesToCopy.patient_dimension) {
  copyTable(0, 2048, patient_dimension_kumc, patient_dimension_nemo,
    'patient_num');
}
if (dataLoaderOptions.tablesToCopy.observation_fact) {
  copyTable(0, 2048, observation_fact_kumc, observation_fact_nemo,
    'encounter_num');
}
if (dataLoaderOptions.tablesToCopy.concept_dimension) {
  copyTable(0, 2048, concept_dimension_kumc, concept_dimension_nemo,
    'concept_path');
}
if (dataLoaderOptions.tablesToCopy.visit_dimension) {
  copyTable(0, 2048, visit_dimension_kumc, visit_dimension_nemo,
    'encounter_num');
}
if (dataLoaderOptions.tablesToCopy.provider_dimension) {
  copyTable(0, 2048, provider_dimension_kumc, provider_dimension_nemo,
    'provider_id');
}
if (dataLoaderOptions.tablesToCopy.code_lookup) {
  copyTable(0, 2048, code_lookup_kumc, code_lookup_nemo, 'table_cd');
}

var dividePatients = function() {
  patient_dimension_nemo.findAll().then(function(patients) {
    patients.forEach(function(patient, i) {
      //  console.log(patient.dataValues.patient_num);
      var patientNum = patient.dataValues.patient_num;
      console.log(patientNum);
      var call1 = learnerPatients.findOne({
        where: {
          patient_num: patientNum
        }
      });
      var call2 = testPatients.findOne({
        where: {
          patient_num: patientNum
        }
      });
      Promise.all([call1, call2]).then(function(results) {
        //console.log(results);
        var learnerPatientResults = results[0];
        var testPatientsResults = results[1];
        if (learnerPatientResults === null && testPatientsResults ===
          null) {
          if (i % 2 === 0) {
            learnerPatients.upsert({
              patient_num: patientNum
            });
          } else {
            testPatients.upsert({
              patient_num: patientNum
            });
          }
        }
      }, function(err) {
        console.log(err);
      });
    });
  });
};
dividePatients = dividePatients;
//dividePatients();
