'use strict';
module.exports = (sequelize, DataTypes) => {
  const Vehicle = sequelize.define('Vehicle', {
    brand: DataTypes.STRING,
    model: DataTypes.STRING,
    licensePlate: DataTypes.STRING,
    color: DataTypes.STRING
  }, {});
  Vehicle.associate = function(models) {
    // associations can be defined here
  };
  return Vehicle;
};