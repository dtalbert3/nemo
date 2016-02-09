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

// Define models for each connection, annoying...wish I knew a way around this
var observation_fact_kumc =
	kumcCon.define('observation_fact', observationFactAttributes, {
    tableName: 'observation_fact',
    freezeTableName: true,
    timestamps: false
  });

var observation_fact_nemo =
	dataMartCon.define('observation_fact', observationFactAttributes, {
    tableName: 'observation_fact',
    freezeTableName: true,
    timestamps: false
  });

// Test to see if we can upsert 1000 rows. Yes we can.
observation_fact_kumc.findAll({limit: 1000}).then(function(facts) {
  // projects will be an array of all Project instances
  	facts.forEach(function(fact) {
  	observation_fact_nemo.upsert(fact.dataValues);
  });
  
});


// Now that data entries are inside the arrays, they need to be put into the tables on the dataMart. Not sure how to do that.
// Also, need to do the same thing here with the concept_dimension, provider_dimension, and maybe code_lookup tables. 

