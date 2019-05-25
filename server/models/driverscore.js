'use strict';
module.exports = (sequelize, DataTypes) => {
  const DriverScore = sequelize.define('DriverScore', {
    value: DataTypes.DECIMAL,
    comments: DataTypes.STRING
  }, {});
  DriverScore.associate = function(models) {
    // associations can be defined here
    DriverScore.belongsTo(models.User, {
      as: 'from'
    });

    DriverScore.belongsTo(models.Driver, {
      as: 'to'
    });

    DriverScore.belongsTo(models.Travel, {
      as: 'travel'
    });
  };
  return DriverScore;
};