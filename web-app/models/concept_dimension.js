var Sequelize = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('concept_dimension', {
    concept_path: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    concept_cd: {
      type: Sequelize.STRING,
      allowNull: true
    },
    name_char: {
      type: Sequelize.STRING,
      allowNull: true
    },
    concept_blob: {
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
    tableName: 'concept_dimension',
    freezeTableName: true,
    timestamps: false
  });
};
