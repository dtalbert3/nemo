/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('visit_dimension', {
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
  }, {
    tableName: 'visit_dimension',
    freezeTableName: true
  });
};
