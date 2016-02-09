/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('qt_breakdown_path', {
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    value: {
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
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'qt_breakdown_path',
    freezeTableName: true
  });
};
