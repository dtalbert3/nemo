/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('datamart_report', {
    total_patient: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    total_observationfact: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    total_event: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    report_date: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'datamart_report',
    freezeTableName: true
  });
};
