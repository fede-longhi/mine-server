'use strict';
module.exports = (sequelize, DataTypes) => {
  const Address = sequelize.define('Address', {
    latitude: DataTypes.DOUBLE,
    longitude: DataTypes.DOUBLE,
    name: DataTypes.STRING
  }, {
    timestamps: false,
  });
  Address.associate = function(models) {
    // associations can be defined here
  };
  return Address;
};