/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('code_lookup', {
    table_cd: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    column_cd: {
      type: DataTypes.STRING,
      allowNull: false
    },
    code_cd: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name_char: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lookup_blob: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    upload_date: {
      type: DataTypes.DATE,
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
    tableName: 'code_lookup',
    freezeTableName: true
  });
};
