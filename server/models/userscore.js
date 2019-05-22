'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserScore = sequelize.define('UserScore', {
    value: DataTypes.DOUBLE,
    comments: DataTypes.STRING
  }, {});
  UserScore.associate = function(models) {
    // associations can be defined here
  };
  return UserScore;
};