/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('qt_query_result_type', {
    result_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    display_type_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    visual_attribute_type_id: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'qt_query_result_type',
    freezeTableName: true
  });
};
