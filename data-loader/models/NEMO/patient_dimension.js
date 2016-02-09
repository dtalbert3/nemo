/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('patient_dimension', {
    patient_num: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      references: {
        model: '',
        key: ''
      }
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
      type: DataTypes.INTEGER(11),
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
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'patient_dimension',
    freezeTableName: true
  });
};
