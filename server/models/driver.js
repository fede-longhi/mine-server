'use strict';
module.exports = (sequelize, DataTypes) => {
  const Driver = sequelize.define('Driver', {
    status: DataTypes.STRING,
    licenseNumber: DataTypes.STRING,
    totalScore: DataTypes.DOUBLE,
    scoreQuantity: DataTypes.INTEGER,
    travelAmount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    }
  }, {});

  Driver.associate = function(models) {
    Driver.belongsTo(models.Party, {
      as: "party",
    });
    Driver.belongsTo(models.Address, {
      as: "location",
    })
  };
  return Driver;
};