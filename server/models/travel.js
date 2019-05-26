const distanceUtil = require('../utils').distanceUtils;

require("custom-env").env("travelQuote");

'use strict';
module.exports = (sequelize, DataTypes) => {
  const Travel = sequelize.define('Travel', {
    status: DataTypes.STRING,
    smallPetQuantity: DataTypes.INTEGER,
    mediumPetQuantity: DataTypes.INTEGER,
    bigPetQuantity: DataTypes.INTEGER,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    price: DataTypes.DOUBLE,
    hasCompanion: DataTypes.BOOLEAN
  },
  {
    // instanceMethods: {
    //   quote: function(){ return 1 }
    // }
  });
  
  Travel.associate = function(models) {
    // associations can be defined here
    Travel.belongsTo(models.Driver, {
      as: 'driver'
    });
    Travel.belongsTo(models.User, {
      as: 'user'
    });
    Travel.belongsTo(models.Address, {
      as: 'from'
    });
    Travel.belongsTo(models.Address, {
      as: 'to'
    })
  };

  Travel.prototype.quote = function(){
    var price = 0;
    price += this.smallPetQuantity * process.env.PRICE_PER_SMALL_PET;
    price += this.mediumPetQuantity * process.env.PRICE_PER_MEDIUM_PET;
    price += this.bigPetQuantity * process.env.PRICE_PER_BIG_PET;
    // console.log(distanceUtil.getDistance(1,2));
    // console.log(this);
    // var distanceMatrixElements = distanceUtil.getDistance(this.fromId, this.toId);
    // console.log(distanceMatrixElements);
    // console.log(distanceMatrixElements.distance.value/100000);
    // console.log(distanceMatrixElements.duration.value);
    // price += (distanceMatrixElements.distance.value/100000)*process.env.PRICE_PER_KM;
    // price += (distanceMatrixElements.duration.value)*process.env.PRICE_PER_MINUTE;
    return price;
  }
  return Travel;
};