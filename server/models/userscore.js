'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserScore = sequelize.define('UserScore', {
    value: DataTypes.DOUBLE,
    comments: DataTypes.STRING
  }, {});
  UserScore.associate = function(models) {
    // associations can be defined here
    UserScore.belongsTo(models.Driver, {
      as: 'from'
    });

    UserScore.belongsTo(models.User, {
      as: 'to'
    });

    UserScore.belongsTo(models.Travel, {
      as: 'travel'
    });
    
  };
  return UserScore;
};