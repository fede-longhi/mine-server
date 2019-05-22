'use strict';
module.exports = (sequelize, DataTypes) => {
  const Travel = sequelize.define('Travel', {
    status: DataTypes.STRING,
    smallPetQuantity: DataTypes.INTEGER,
    mediumPetQuantity: DataTypes.INTEGER,
    bigPetQuantity: DataTypes.INTEGER,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    price: DataTypes.DOUBLE,
    hasCompanion: DataTypes.BOOLEAN
  }, {});
  Travel.associate = function(models) {
    // associations can be defined here
  };
  return Travel;
};