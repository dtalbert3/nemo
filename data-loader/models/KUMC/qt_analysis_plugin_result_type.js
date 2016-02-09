/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('qt_analysis_plugin_result_type', {
    plugin_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    result_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'qt_analysis_plugin_result_type',
    freezeTableName: true
  });
};
