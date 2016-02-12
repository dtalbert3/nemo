/* jshint indent: 2 */
var Sequelize = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('patient_dimension', {
    patient_num: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    vital_status_cd: {
      type: Sequelize.STRING,
      allowNull: true
    },
    birth_date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    death_date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    sex_cd: {
      type: Sequelize.STRING,
      allowNull: true
    },
    age_in_years_num: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    language_cd: {
      type: Sequelize.STRING,
      allowNull: true
    },
    race_cd: {
      type: Sequelize.STRING,
      allowNull: true
    },
    marital_status_cd: {
      type: Sequelize.STRING,
      allowNull: true
    },
    religion_cd: {
      type: Sequelize.STRING,
      allowNull: true
    },
    zip_cd: {
      type: Sequelize.STRING,
      allowNull: true
    },
    statecityzip_path: {
      type: Sequelize.STRING,
      allowNull: true
    },
    income_cd: {
      type: Sequelize.STRING,
      allowNull: true
    },
    patient_blob: {
      type: Sequelize.TEXT,
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
    }
  }, {
    tableName: 'patient_dimension',
    freezeTableName: true,
    timestamps: false
  });
};
