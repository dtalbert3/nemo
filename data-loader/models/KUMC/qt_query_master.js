/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('qt_query_master', {
    query_master_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    group_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    master_type_cd: {
      type: DataTypes.STRING,
      allowNull: true
    },
    plugin_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    create_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    delete_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    delete_flag: {
      type: DataTypes.STRING,
      allowNull: true
    },
    request_xml: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    generated_sql: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    i2b2_request_xml: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    pm_xml: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'qt_query_master',
    freezeTableName: true
  });
};
