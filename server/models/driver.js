'use strict';
module.exports = (sequelize, DataTypes) => {
  const Driver = sequelize.define('Driver', {
    status: DataTypes.STRING,
    licenseNumber: DataTypes.STRING
  }, {});
  Driver.associate = function(models) {
    // associations can be defined here
  };
  return Driver;
};