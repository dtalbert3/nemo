/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('qt_xml_result', {
    xml_result_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    result_instance_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'qt_query_result_instance',
        key: 'result_instance_id'
      }
    },
    xml_value: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'qt_xml_result',
    freezeTableName: true
  });
};
