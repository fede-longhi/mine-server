'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    status: DataTypes.STRING,
    totalScore: DataTypes.NUMBER,
    scoreQuantity: DataTypes.NUMBER
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};