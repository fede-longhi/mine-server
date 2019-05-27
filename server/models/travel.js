const distanceUtil = require('../utils').distanceUtils;
const utils = require('../utils').utils;

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
    hasCompanion: DataTypes.BOOLEAN,
    // from: DataTypes.STRING,
    // to: DataTypes.STRING
  },
  {});
  
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
    var travel = this;
    var price = 0;
    price += this.smallPetQuantity * process.env.PRICE_PER_SMALL_PET;
    price += this.mediumPetQuantity * process.env.PRICE_PER_MEDIUM_PET;
    price += this.bigPetQuantity * process.env.PRICE_PER_BIG_PET;
    price = parseFloat(price);
    if (this.hasCompanion){
      price += parseFloat(process.env.PRICE_COMPANION);
    }

    return new Promise(function(resolve, reject){
      var origin = travel.from.latitude.toString() + ',' + travel.from.longitude.toString();
      var destination = travel.to.latitude.toString() + ',' + travel.to.longitude.toString();
      distanceUtil.getDistance(origin, destination)
      .then(distanceElements => {

        price += (distanceElements.distance.value/1000) * process.env.PRICE_PER_KM;
        price += (distanceElements.duration.value/60) * process.env.PRICE_PER_MINUTE;
        
        if (utils.isNightTime(travel.startDate)){
          price += price*process.env.PERCENTAGE_NIGHT_PRICE;
        }
        resolve(price);
      })
      .catch(error => reject(error));
    });
  };

  return Travel;
};