/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('qt_analysis_plugin', {
    plugin_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    plugin_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    version_cd: {
      type: DataTypes.STRING,
      allowNull: true
    },
    parameter_info: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    parameter_info_xsd: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    command_line: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    working_folder: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    commandoption_cd: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    plugin_icon: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status_cd: {
      type: DataTypes.STRING,
      allowNull: true
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    group_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    create_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    update_date: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'qt_analysis_plugin',
    freezeTableName: true
  });
};
