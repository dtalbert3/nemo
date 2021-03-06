/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('modifier_dimension', {
    modifier_path: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    modifier_cd: {
      type: DataTypes.STRING,
      allowNull: true
    },
    name_char: {
      type: DataTypes.STRING,
      allowNull: true
    },
    modifier_blob: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    update_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    download_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    import_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    sourcesystem_cd: {
      type: DataTypes.STRING,
      allowNull: true
    },
    upload_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'modifier_dimension',
    freezeTableName: true
  });
};
