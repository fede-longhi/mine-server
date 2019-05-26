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
    Travel.belongsTo(models.Driver, {
      as: 'driver'
    });
    Travel.belongsTo(models.User, {
      as: 'user'
    });
    Travel.belongsTo(models.Address, {
      as: 'from'
    });
    Travel.belongsTo(models.Address, {
      as: 'to'
    })
  };
  return Travel;
};