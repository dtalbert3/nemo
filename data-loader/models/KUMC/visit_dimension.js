/* jshint indent: 2 */
var Sequelize = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('visit_dimension', {
    encounter_num: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    patient_num: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    active_status_cd: {
      type: Sequelize.STRING,
      allowNull: true
    },
    start_date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    end_date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    inout_cd: {
      type: Sequelize.STRING,
      allowNull: true
    },
    location_cd: {
      type: Sequelize.STRING,
      allowNull: true
    },
    location_path: {
      type: Sequelize.STRING,
      allowNull: true
    },
    length_of_stay: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    visit_blob: {
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
    tableName: 'visit_dimension',
    freezeTableName: true,
    timestamps: false
  });
};
