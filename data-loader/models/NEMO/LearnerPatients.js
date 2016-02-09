/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('LearnerPatients', {
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
    tableName: 'LearnerPatients',
    freezeTableName: true
  });
};
