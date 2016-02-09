/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('source_master', {
    source_cd: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    create_date: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'source_master',
    freezeTableName: true
  });
};
