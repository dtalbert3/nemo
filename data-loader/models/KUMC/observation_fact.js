/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('observation_fact', {
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
  }, {
    tableName: 'observation_fact',
    freezeTableName: true
  });
};
