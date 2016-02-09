/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('TestPatients', {
    patient_num: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      references: {
        model: '',
        key: ''
      }
    }
  }, {
    tableName: 'TestPatients',
    freezeTableName: true
  });
};
