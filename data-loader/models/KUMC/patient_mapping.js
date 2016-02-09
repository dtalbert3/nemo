/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('patient_mapping', {
    patient_ide: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    patient_ide_source: {
      type: DataTypes.STRING,
      allowNull: false
    },
    patient_num: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    patient_ide_status: {
      type: DataTypes.STRING,
      allowNull: true
    },
    project_id: {
      type: DataTypes.STRING,
      allowNull: false
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
  }, {
    tableName: 'patient_mapping',
    freezeTableName: true
  });
};
