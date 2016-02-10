/* jshint indent: 2 */
var Sequelize = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('observation_fact', {
    encounter_num: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    patient_num: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    concept_cd: {
      type: Sequelize.STRING,
      allowNull: false
    },
    provider_id: {
      type: Sequelize.STRING,
      allowNull: false
    },
    start_date: {
      type: Sequelize.DATE,
      allowNull: false
    },
    modifier_cd: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '@'
    },
    instance_num: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: '1'
    },
    valtype_cd: {
      type: Sequelize.STRING,
      allowNull: true
    },
    tval_char: {
      type: Sequelize.STRING,
      allowNull: true
    },
    nval_num: {
      type: 'NUMERIC',
      allowNull: true
    },
    valueflag_cd: {
      type: Sequelize.STRING,
      allowNull: true
    },
    quantity_num: {
      type: 'NUMERIC',
      allowNull: true
    },
    units_cd: {
      type: Sequelize.STRING,
      allowNull: true
    },
    end_date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    location_cd: {
      type: Sequelize.STRING,
      allowNull: true
    },
    observation_blob: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    confidence_num: {
      type: 'NUMERIC',
      allowNull: true
    },
    update_date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    download_date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    import_date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    sourcesystem_cd: {
      type: Sequelize.STRING,
      allowNull: true
    },
    upload_id: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    text_search_index: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 'nextval(observation_fact_text_search_index_seq::regclass)'
    }
  }, {
    tableName: 'observation_fact',
    freezeTableName: true,
    timestamps: false
  });
};
