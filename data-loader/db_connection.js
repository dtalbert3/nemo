var sequelize = require('sequelize');
var kumcCon = new sequelize('KUMC_NEMO', 'NEMO_WEB', 'NEMO', {
  host: 'codyemoffitt.com',
  dialect: 'postgres',
  port: 5432,

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
	pool: {
		max: 5,
		min: 0,
		idle: 10000
	}
});

//Load models
//Had to assing DataTypes to sequelize for the auto generated model
var DataTypes = sequelize;

//Attributes in an object, since I use it for each connection.
var observationFactAttributes = 
{
    encounter_num: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    patient_num: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    concept_cd: {
      type: DataTypes.STRING,
      allowNull: false
    },
    provider_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    modifier_cd: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '@'
    },
    instance_num: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '1'
    },
    valtype_cd: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tval_char: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nval_num: {
      type: 'NUMERIC',
      allowNull: true
    },
    valueflag_cd: {
      type: DataTypes.STRING,
      allowNull: true
    },
    quantity_num: {
      type: 'NUMERIC',
      allowNull: true
    },
    units_cd: {
      type: DataTypes.STRING,
      allowNull: true
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    location_cd: {
      type: DataTypes.STRING,
      allowNull: true
    },
    observation_blob: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    confidence_num: {
      type: 'NUMERIC',
      allowNull: true
    },
    update_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    download_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    import_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    sourcesystem_cd: {
      type: DataTypes.STRING,
      allowNull: true
    },
    upload_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    text_search_index: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 'nextval(observation_fact_text_search_index_seq::regclass)'
    }
};

var observationFactOptions = 
{
    tableName: 'observation_fact',
    freezeTableName: true,
    timestamps: false
};

var patientDimensionAttributes = 
{
    patient_num: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    vital_status_cd: {
      type: DataTypes.STRING,
      allowNull: true
    },
    birth_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    death_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    sex_cd: {
      type: DataTypes.STRING,
      allowNull: true
    },
    age_in_years_num: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    language_cd: {
      type: DataTypes.STRING,
      allowNull: true
    },
    race_cd: {
      type: DataTypes.STRING,
      allowNull: true
    },
    marital_status_cd: {
      type: DataTypes.STRING,
      allowNull: true
    },
    religion_cd: {
      type: DataTypes.STRING,
      allowNull: true
    },
    zip_cd: {
      type: DataTypes.STRING,
      allowNull: true
    },
    statecityzip_path: {
      type: DataTypes.STRING,
      allowNull: true
    },
    income_cd: {
      type: DataTypes.STRING,
      allowNull: true
    },
    patient_blob: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    update_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    download_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    import_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    sourcesystem_cd: {
      type: DataTypes.STRING,
      allowNull: true
    },
    upload_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
};  

var patientDimensionOptions =  
{
  tableName: 'patient_dimension',
  freezeTableName: true,
  timestamps: false
};

var providerDimensionAttributes =
{
    provider_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    provider_path: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name_char: {
      type: DataTypes.STRING,
      allowNull: true
    },
    provider_blob: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    update_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    download_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    import_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    sourcesystem_cd: {
      type: DataTypes.STRING,
      allowNull: true
    },
    upload_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
};

var providerDimensionOptions = 
{
  tableName: 'provider_dimension',
  freezeTableName: true,
  timestamps: false
};

var visitDimensionAttributes = 
{
    encounter_num: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    patient_num: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    active_status_cd: {
      type: DataTypes.STRING,
      allowNull: true
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    inout_cd: {
      type: DataTypes.STRING,
      allowNull: true
    },
    location_cd: {
      type: DataTypes.STRING,
      allowNull: true
    },
    location_path: {
      type: DataTypes.STRING,
      allowNull: true
    },
    length_of_stay: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    visit_blob: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    update_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    download_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    import_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    sourcesystem_cd: {
      type: DataTypes.STRING,
      allowNull: true
    },
    upload_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
};
var visitDimensionOptions = 
{
  tableName: 'visit_dimension',
  freezeTableName: true,
  timestamps: false
};

var conceptDimensionAttributes = 
{
    concept_path: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    concept_cd: {
      type: DataTypes.STRING,
      allowNull: true
    },
    name_char: {
      type: DataTypes.STRING,
      allowNull: true
    },
    concept_blob: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    update_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    download_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    import_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    sourcesystem_cd: {
      type: DataTypes.STRING,
      allowNull: true
    },
    upload_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  };

var conceptDimensionOptions = 
{
  tableName: 'concept_dimension',
  freezeTableName: true,
  timestamps: false
};

var codeLookupAttributes = 
{
    table_cd: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    column_cd: {
      type: DataTypes.STRING,
      allowNull: false
    },
    code_cd: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name_char: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lookup_blob: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    upload_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    update_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    download_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    import_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    sourcesystem_cd: {
      type: DataTypes.STRING,
      allowNull: true
    },
    upload_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  };

var codeLookupOptions = 
{
    tableName: 'code_lookup',
    freezeTableName: true,
    timestamps: false
};


// Define models for each connection, annoying...wish I knew a way around this
var observation_fact_kumc =
	kumcCon.define('observation_fact', observationFactAttributes, observationFactOptions);

var observation_fact_nemo =
	dataMartCon.define('observation_fact', observationFactAttributes, observationFactOptions);

var patient_dimension_kumc =
  kumcCon.define('patient_dimension', patientDimensionAttributes, patientDimensionOptions);

var patient_dimension_nemo =
  dataMartCon.define('patient_dimension', patientDimensionAttributes, patientDimensionOptions);

var provider_dimension_kumc =
  kumcCon.define('provider_dimension', providerDimensionAttributes, providerDimensionOptions);

var provider_dimension_nemo =
  dataMartCon.define('provider_dimension', providerDimensionAttributes, providerDimensionOptions);

var visit_dimension_kumc =
  kumcCon.define('visit_dimension', visitDimensionAttributes, visitDimensionOptions);

var visit_dimension_nemo =
  dataMartCon.define('visit_dimension', visitDimensionAttributes, visitDimensionOptions);

var concept_dimension_kumc =
  kumcCon.define('concept_dimension', conceptDimensionAttributes, conceptDimensionOptions);

var concept_dimension_nemo =
  dataMartCon.define('concept_dimension', conceptDimensionAttributes, conceptDimensionOptions);

var code_lookup_kumc =
  kumcCon.define('code_lookup', codeLookupAttributes, codeLookupOptions);
var code_lookup_nemo =
  dataMartCon.define('code_lookup', codeLookupAttributes, codeLookupOptions);

// Copy everything
var copyObservationFact = function() {
  observation_fact_kumc.findAll().then(function(facts) {
  	facts.forEach(function(fact) {
  	observation_fact_nemo.upsert(fact.dataValues);
    });
  });
};

var copyPatientDimension = function(){
  patient_dimension_kumc.findAll().then(function(patients) {
    patients.forEach(function(patient) {
    patient_dimension_nemo.upsert(patient.dataValues);
    });
  });
};

var copyVisitDimension = function(){
  visit_dimension_kumc.findAll().then(function(visits) {
    visits.forEach(function(visit) {
    visit_dimension_nemo.upsert(visit.dataValues);
    });
  });
};

var copyConceptDimension = function(){
  concept_dimension_kumc.findAll().then(function(concepts) {
    concepts.forEach(function(concept) {
    concept_dimension_nemo.upsert(concept.dataValues);
    });
});
};

var copyProviderDimension = function(){
  provider_dimension_kumc.findAll().then(function(providers) {
    providers.forEach(function(provider) {
    provider_dimension_nemo.upsert(provider.dataValues);
    });
  });
}

var copyCodeLookup = function() {
  code_lookup_kumc.findAll().then(function(codes) {
    codes.forEach(function(code) {
    code_lookup_nemo.upsert(code.dataValues);
    });
  });
}

//Models for learner and test patients

var learnerPatients = dataMartCon.define('LearnerPatients', {
    patient_num: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      references: {
        model: '',
        key: ''
      }
    }
  }, {
    tableName: 'LearnerPatients',
    freezeTableName: true,
    timestamps: false
  });

var testPatients = dataMartCon.define('TestPatients', {
    patient_num: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      references: {
        model: '',
        key: ''
      }
    }
  }, {
    tableName: 'TestPatients',
    freezeTableName: true,
    timestamps: false
  });

var dividePatients = function(){
  var learnerPatient = false;
  patient_dimension_nemo.findAll().then(function(patients){
    for(var patient in patients){
      if(learnerPatient){
        learnerPatients.upsert({patient_num: patient.dataValues.patient_num});
      }
      else{
        testPatients.upsert({patient_num: patient.dataValues.patient_num});
      }

      learnerPatient = !learnerPatient;
    }
  })
};

// This fails, packet is too large. Need to split
kumcCon.query("SELECT encounter_num, patient_num, concept_cd, provider_id, start_date, modifier_cd, instance_num, valtype_cd, tval_char, nval_num, valueflag_cd, quantity_num, units_cd, end_date, location_cd, observation_blob, confidence_num, update_date, download_date, import_date, sourcesystem_cd, upload_id, text_search_index FROM observation_fact;", { type: sequelize.QueryTypes.SELECT})
  .then(function(observations) {
    // We don't need spread here, since only the results will be returned for select queries
    console.log(observations);
    observation_fact_nemo.bulkCreate(observations);

  });

// Now that data entries are inside the arrays, they need to be put into the tables on the dataMart. Not sure how to do that.
// Also, need to do the same thing here with the concept_dimension, provider_dimension, and maybe code_lookup tables. 

