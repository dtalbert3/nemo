var sequelize = require('sequelize');
var fs = require('fs');
// var Promise = require('promise');
var Q = require('q');

// Generic function for wrapping functions
var wrapFunction = function(fn, context, params) {
    return function() {
       fn.apply(context, params);
    };
  };

// Load the config
var data = fs.readFileSync('./dataLoaderConfig.json'),
  dataLoaderOptions;

try {
  dataLoaderOptions = JSON.parse(data);
} catch (err) {
  console.log('There has been an error parsing your JSON.');
  console.log(err);
  process.exit();
}

// Set some queries for later
// var readmittanceQuery = 'INSERT INTO PatientReadmittance (patient_num) SELECT patient_num FROM patient_dimension WHERE patient_num NOT IN (SELECT patient_num FROM PatientReadmittance);';
// var readmittanceQuery2 = 'UPDATE PatientReadmittance' +
// ' SET '+
// ' readmitted  = 1 ' +
// ' WHERE patient_num IN ' +
// '(SELECT patient_num FROM ' +
// '	( '+
// '		SELECT ' +
// '		vIn.patient_num, ' +
// '		vIn.start_date as InStart, ' +
// '		vIn.end_date as InEnd, ' +
// '		vOut.start_date as OutStart, ' +
// '		vOut.end_date as OutEnd ' +
// '		FROM NEMO_Datamart.visit_dimension vOut ' +
// '		INNER JOIN NEMO_Datamart.visit_dimension vIn ON vIn.patient_num = vOut.patient_num AND vIn.encounter_num <> vOut.encounter_num '  +
// '		WHERE ' +
// '		vIn.inout_cd = \'I\' ' +
// '		AND vOut.inout_cd = \'I\' ' +
// '		AND vIn.start_date BETWEEN vOut.start_date AND DATE_ADD(vOut.start_date,INTERVAL 30 DAY) ' +
// '		ORDER BY vIn.patient_num, vOut.end_date ASC ' +
// '	) as readmitted ' +
// '); ';
//
// var readmittanceQuery3 = 'UPDATE PatientReadmittance' +
// ' SET '+
// ' readmitted  = 1 ' +
// ' WHERE patient_num IN ' +
// '(SELECT patient_num FROM ' +
// '	( '+
// '		SELECT ' +
// '		vIn.patient_num, ' +
// '		vIn.start_date as InStart, ' +
// '		vIn.end_date as InEnd, ' +
// '		vOut.start_date as OutStart, ' +
// '		vOut.end_date as OutEnd ' +
// '   FROM NEMO_Datamart.observation_fact vOut ' +
// '   INNER JOIN NEMO_Datamart.observation_fact vIn ON vIn.patient_num = vOut.patient_num AND vIn.encounter_num <> vOut.encounter_num' +
// '   WHERE ' +
// '   vIn.modifier_cd = \'DiagObs:Inpatient\' ' +
// '   and vOut.modifier_cd = \'DiagObs:Inpatient\' ' +
// '		AND vIn.start_date BETWEEN vOut.start_date AND DATE_ADD(vOut.start_date,INTERVAL 30 DAY) ' +
// '		ORDER BY vIn.patient_num, vOut.end_date ASC ' +
// '	) as readmitted ' +
// '); ';

// Open the connections
var kumcCon = new sequelize(dataLoaderOptions.kumcConnection.dbName,
  dataLoaderOptions.kumcConnection.userName, dataLoaderOptions.kumcConnection
  .password, dataLoaderOptions.kumcConnection.sequelizeOptions);
var dataMartCon = new sequelize(dataLoaderOptions.nemoConnection.dbName,
  dataLoaderOptions.nemoConnection.userName, dataLoaderOptions.nemoConnection
  .password, dataLoaderOptions.nemoConnection.sequelizeOptions);

// Define models for NEMO connection
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
// var learnerPatients = require('./models/NEMO/LearnerPatients')(dataMartCon);
// var testPatients = require('./models/NEMO/TestPatients')(dataMartCon);


// This function breaks the table into chunks and copies them from the source postgres DB to the target DB
var copyTable = function(deferred, start, chunk, sourceModel, destModel,
  orderColumn,
  whereClause, callBackFunction) {

  callBackFunction = callBackFunction;
  whereClause = null || whereClause;
  if(deferred === null){
    deferred = Q.defer();
  }
  sourceModel.findAll({
      offset: start,
      limit: chunk,
      order: [
        [orderColumn, 'DESC']
      ],
      ignoreDuplicates: true,
      where: whereClause
    })
    .then(function(rows) {
      // Split selection into chunks, and insert them into NEMO Datamart
      // Function to extract dataValues for insertion into target DB
      console.log('Start: ', start);
      console.log(sourceModel.tableName);
      var result = rows.map(function(a) {
        return a.dataValues;
      });
      console.log('Result length', result.length);
      var nextCall;
      if (result.length < chunk) {
        nextCall = deferred.resolve;
      } else {
        nextCall = wrapFunction(copyTable, this, [deferred, (start + chunk), chunk,sourceModel, destModel, orderColumn, whereClause,callBackFunction]);
      }

      destModel.bulkCreate(result, {
        ignoreDuplicates: true
      }).then(
        function() {
          if (typeof(nextCall) === 'function') {
            nextCall();
          }
        }).error(
        function(err) {
          console.log(err);
        }).catch(function(reason) {
        console.log(reason);
      });
    });

    return(deferred);
};

// Function to divide patients into test and learner data
// var dividePatients = function() {
//
//   var deferred = Q.defer();
//   console.log('\nDividing Patients into Test and Learner tables.');
//   patient_dimension_nemo.findAll().then(function(patients) {
//     patients.forEach(function(patient, i) {
//       // console.log(patient.dataValues.patient_num);
//       var patientNum = patient.dataValues.patient_num;
//       //console.log(patientNum);
//       var call1 = learnerPatients.findOne({
//         where: {
//           patient_num: patientNum
//         }
//       });
//       var call2 = testPatients.findOne({
//         where: {
//           patient_num: patientNum
//         }
//       });
//       Promise.all([call1, call2]).then(function(results) {
//         //console.log(results);
//         var learnerPatientResults = results[0];
//         var testPatientsResults = results[1];
//         if (learnerPatientResults === null &&
//           testPatientsResults ===
//           null) {
//           if (i % 2 === 0) {
//             learnerPatients.upsert({
//               patient_num: patientNum
//             });
//           } else {
//             testPatients.upsert({
//               patient_num: patientNum
//             });
//           }
//
//           if(i >= (patients.length - 1))
//           {
//             // console.log("i > ", patients.length-1);
//             deferred.resolve();
//           }
//         }
//       }, function(err) {
//         console.log(err);
//       });
//     });
//   });
//
//   return deferred.promise;
// };




// var copyObservationsForPatients = function() {
//
//     console.log("\nCopying the observation_fact table.");
//     patient_dimension_nemo.findAll().then(function(patients) {
//       var patientNums = patients.map(function(a) {
//         return a.dataValues.patient_num;
//       });
//
//       return copyTable(0, 2048, observation_fact_kumc, observation_fact_nemo,
//         'encounter_num', {
//           patient_num: {
//             $in: patientNums
//           }
//         });
//
//     });
// };

// var findReadmittanceForPatients = function(){
//   // console.log("\nCreating readmittance data for patients.");
//   var deferred1 = Q.defer();
//   var deferred2 = Q.defer();
//   var deferred3 = Q.defer();
//   dataMartCon.query(readmittanceQuery, { type: sequelize.QueryTypes.UPDATE }).then(deferred1.resolve());
//   dataMartCon.query(readmittanceQuery2, { type: sequelize.QueryTypes.UPDATE }).then(deferred2.resolve());
//   dataMartCon.query(readmittanceQuery3, { type: sequelize.QueryTypes.UPDATE }).then(deferred3.resolve());
//   return [deferred1, deferred2, deferred3].reduce(Q.when, Q());
// };

// Copy all the I2B2 tables

var patientDeferred  = Q.defer();
var conceptDeferred = Q.defer();
var visitDeferred = Q.defer();
var providerDeferred = Q.defer();
var codelookupDeferred = Q.defer();
var obsFactDeferred = Q.defer();

var getPatients = wrapFunction(copyTable, this, [patientDeferred, 0, 2048, patient_dimension_kumc, patient_dimension_nemo,'patient_num']);
var getConcepts = wrapFunction(copyTable, this, [conceptDeferred, 0, 2048, concept_dimension_kumc, concept_dimension_nemo,'concept_path']);
var getVisits = wrapFunction(copyTable, this, [visitDeferred, 0, 2048, visit_dimension_kumc, visit_dimension_nemo,'encounter_num']);
var getProviders = wrapFunction(copyTable, this, [providerDeferred, 0, 2048, provider_dimension_kumc, provider_dimension_nemo,'provider_id']);
var getCodeLookup = wrapFunction(copyTable, this, [codelookupDeferred, 0, 2048, code_lookup_kumc, code_lookup_nemo,'table_cd']);
var getObservationFact = wrapFunction(copyTable, this, [obsFactDeferred, 0, 2048, observation_fact_kumc, observation_fact_nemo,'encounter_num']);

if (dataLoaderOptions.tablesToCopy.patient_dimension) {
  console.log('\nCopying the patient_dimension table.');
   getPatients();
}
else{
  patientDeferred.resolve();
}


patientDeferred.promise.done(function(){if(dataLoaderOptions.tablesToCopy.concept_dimension){console.log('\nCopying the concept_dimension table.'); getConcepts();} else{conceptDeferred.resolve();}});
conceptDeferred.promise.done(function(){if(dataLoaderOptions.tablesToCopy.visit_dimension){ console.log('\nCopying the visit_dimension table.'); getVisits();} else{visitDeferred.resolve();}});
visitDeferred.promise.done(function(){if(dataLoaderOptions.tablesToCopy.provider_dimension){console.log('\nCopying the provider_dimension table.'); getProviders();} else{providerDeferred.resolve();}});
providerDeferred.promise.done(function(){if(dataLoaderOptions.tablesToCopy.code_lookup){console.log('\nCopying the code_lookup table.'); getCodeLookup();} else{codelookupDeferred.resolve();}});
codelookupDeferred.promise.done(function(){if(dataLoaderOptions.tablesToCopy.observation_fact){console.log('\nCopying the observation_fact table.'); getObservationFact();} else{obsFactDeferred.resolve();}});
obsFactDeferred.promise.done(function(){console.log('\n\nFinished\n\n'); process.exit();});

// if (dataLoaderOptions.dividePatients) {
//   // dividePatients();
// }
// if (dataLoaderOptions.findReadmittance) {
//   // findReadmittanceForPatients();
// }
