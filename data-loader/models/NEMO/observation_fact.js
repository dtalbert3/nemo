/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('observation_fact', {
    encounter_num: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      references: {
        model: '',
        key: ''
      }
    },
    patient_num: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      references: {
        model: '',
        key: ''
      }
    },
    concept_cd: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      references: {
        model: '',
        key: ''
      }
    },
    provider_id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      references: {
        model: '',
        key: ''
      }
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
      primaryKey: true,
      references: {
        model: '',
        key: ''
      }
    },
    modifier_cd: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '@',
      primaryKey: true,
      references: {
        model: '',
        key: ''
      }
    },
    instance_num: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '1',
      primaryKey: true,
      references: {
        model: '',
        key: ''
      }
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
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    valueflag_cd: {
      type: DataTypes.STRING,
      allowNull: true
    },
    quantity_num: {
      type: DataTypes.DECIMAL,
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
      type: DataTypes.DECIMAL,
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
    },
    text_search_index: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    }
  }, {
    tableName: 'observation_fact',
    freezeTableName: true
  });
};
