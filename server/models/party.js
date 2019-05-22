'use strict';
module.exports = (sequelize, DataTypes) => {
  const Party = sequelize.define('Party', {
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    dni: DataTypes.STRING
  }, {});
  Party.associate = function(models) {
    // associations can be defined here
  };
  return Party;
};