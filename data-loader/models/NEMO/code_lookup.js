/* jshint indent: 2 */
var Sequelize = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('code_lookup', {
    table_cd: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    column_cd: {
      type: Sequelize.STRING,
      allowNull: false
    },
    code_cd: {
      type: Sequelize.STRING,
      allowNull: false
    },
    name_char: {
      type: Sequelize.STRING,
      allowNull: true
    },
    lookup_blob: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    upload_date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    update_date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    download_date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    import_date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    sourcesystem_cd: {
      type: Sequelize.STRING,
      allowNull: true
    },
    upload_id: {
      type: Sequelize.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'code_lookup',
    freezeTableName: true,
    timestamps: false
  });
};
