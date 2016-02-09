/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('set_type', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    create_date: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'set_type',
    freezeTableName: true
  });
};
