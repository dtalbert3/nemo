/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('qt_query_status_type', {
    status_type_id: {
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
    }
  }, {
    tableName: 'qt_query_status_type',
    freezeTableName: true
  });
};
