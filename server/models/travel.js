'use strict';
module.exports = (sequelize, DataTypes) => {
  const Travel = sequelize.define('Travel', {
    status: DataTypes.STRING,
    smallPetQuantity: DataTypes.NUMBER,
    mediumPetQuantity: DataTypes.NUMBER,
    bigPetQuantity: DataTypes.NUMBER,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    price: DataTypes.NUMBER,
    hasCompanion: DataTypes.BOOLEAN
  }, {});
  Travel.associate = function(models) {
    // associations can be defined here
  };
  return Travel;
};