/* jshint indent: 2 */
var Sequelize = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('provider_dimension', {
    provider_id: {
      type: Sequelize.STRING,
      allowNull: false
    },
    provider_path: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name_char: {
      type: Sequelize.STRING,
      allowNull: true
    },
    provider_blob: {
      type: Sequelize.TEXT,
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
    tableName: 'provider_dimension',
    freezeTableName: true,
    timestamps: false
  });
};
