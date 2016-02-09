/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('qt_query_instance', {
    query_instance_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    query_master_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'qt_query_master',
        key: 'query_master_id'
      }
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    group_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    batch_mode: {
      type: DataTypes.STRING,
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
    delete_flag: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status_type_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'qt_query_status_type',
        key: 'status_type_id'
      }
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'qt_query_instance',
    freezeTableName: true
  });
};
