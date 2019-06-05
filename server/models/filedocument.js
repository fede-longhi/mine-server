'use strict';
module.exports = (sequelize, DataTypes) => {
  const FileDocument = sequelize.define('FileDocument', {
    name: DataTypes.STRING,
    extension: DataTypes.STRING,
    data: DataTypes.TEXT
  }, {});
  FileDocument.associate = function(models) {
    // associations can be defined here
    FileDocument.belongsTo(models.Party, {
      as: 'party'
    });
  };
  return FileDocument;
};