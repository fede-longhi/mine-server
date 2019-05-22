'use strict';
module.exports = (sequelize, DataTypes) => {
  const DriverScore = sequelize.define('DriverScore', {
    value: DataTypes.NUMBER,
    comments: DataTypes.STRING
  }, {});
  DriverScore.associate = function(models) {
    // associations can be defined here
  };
  return DriverScore;
};