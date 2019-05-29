'use strict';
module.exports = (sequelize, DataTypes) => {
  const Driver = sequelize.define('Driver', {
    status: DataTypes.STRING,
    licenseNumber: DataTypes.STRING,
    totalScore: DataTypes.DOUBLE,
    scoreQuantity: DataTypes.INTEGER,
    travelAmount: DataTypes.INTEGER
  }, {});

  Driver.associate = function(models) {
    Driver.belongsTo(models.Party, {
      as: "party",
    });
  };
  return Driver;
};