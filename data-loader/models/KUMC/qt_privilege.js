/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('qt_privilege', {
    protection_label_cd: {
      type: DataTypes.STRING,
      allowNull: true
    },
    dataprot_cd: {
      type: DataTypes.STRING,
      allowNull: true
    },
    hivemgmt_cd: {
      type: DataTypes.STRING,
      allowNull: true
    },
    plugin_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'qt_privilege',
    freezeTableName: true
  });
};
