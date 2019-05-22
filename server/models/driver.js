'use strict';
module.exports = (sequelize, DataTypes) => {
  const Driver = sequelize.define('Driver', {
    status: DataTypes.STRING,
    licenseNumber: DataTypes.STRING,
    totalScore: DataTypes.DOUBLE,
    scoreQuantity: DataTypes.INTEGER
  }, {});

  Driver.associate = function(models) {
    Driver.hasOne(models.Party, {
      foreignKey: "partyId",
      as: "party",
    })
  };
  return Driver;
};