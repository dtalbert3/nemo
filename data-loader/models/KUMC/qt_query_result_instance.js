/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('qt_query_result_instance', {
    result_instance_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    query_instance_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'qt_query_instance',
        key: 'query_instance_id'
      }
    },
    result_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'qt_query_result_type',
        key: 'result_type_id'
      }
    },
    set_size: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'qt_query_status_type',
        key: 'status_type_id'
      }
    },
    delete_flag: {
      type: DataTypes.STRING,
      allowNull: true
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    real_set_size: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    obfusc_method: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'qt_query_result_instance',
    freezeTableName: true
  });
};
