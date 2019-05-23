'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    status: DataTypes.STRING,
    totalScore: DataTypes.DOUBLE,
    scoreQuantity: DataTypes.INTEGER
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    User.belongsTo(models.Party, {
      as: 'party'
    });
  };
  return User;
};