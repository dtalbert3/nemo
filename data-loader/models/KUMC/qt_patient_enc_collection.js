/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('qt_patient_enc_collection', {
    patient_enc_coll_id: {
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
    set_index: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    patient_num: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    encounter_num: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'qt_patient_enc_collection',
    freezeTableName: true
  });
};
