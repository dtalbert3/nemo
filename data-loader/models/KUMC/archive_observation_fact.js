/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('archive_observation_fact', {
    encounter_num: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    patient_num: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    concept_cd: {
      type: DataTypes.STRING,
      allowNull: true
    },
    provider_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    modifier_cd: {
      type: DataTypes.STRING,
      allowNull: true
    },
    instance_num: {
      type: DataTypes.INTEGER,
      allowNull: true
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
      allowNull: true
    },
    archive_upload_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'archive_observation_fact',
    freezeTableName: true
  });
};
