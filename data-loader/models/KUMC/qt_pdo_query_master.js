/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('qt_pdo_query_master', {
    query_master_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    group_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    create_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    request_xml: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    i2b2_request_xml: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'qt_pdo_query_master',
    freezeTableName: true
  });
};
