/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('set_upload_status', {
    upload_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    set_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'set_type',
        key: 'id'
      }
    },
    source_cd: {
      type: DataTypes.STRING,
      allowNull: false
    },
    no_of_record: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    loaded_record: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    deleted_record: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    load_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    load_status: {
      type: DataTypes.STRING,
      allowNull: true
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    input_file_name: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    log_file_name: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    transform_name: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'set_upload_status',
    freezeTableName: true
  });
};
