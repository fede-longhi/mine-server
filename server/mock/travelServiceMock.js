/*require('console-info');
require('console-error');
require('custom-env').env('pmm');*/

var travelModel = require("../dtos/model/travel"),
    partyService = require("./mockData/partyServiceMock"),
    //global = require('../../util/util'),
    haversine = require('haversine');

var travels = new Map();
var travelID = 0;

module.exports = {
    /*findTravelById : function findTravelById(id) {
        console.info("travelServiceMock: findTravelById");
        var aTravel = null;
        if (travels.has(id)) {
            aTravel = travels.get(id);
        }
        return aTravel;
    },*/
    
    findDriver : function findDriver(driverID) {
        console.info("travelServiceMock: findDriver " + driverID);
        var driver = partyService.findAllDrivers().find(function(driver) {
            return driver.id == driverID;
        }); 
        return driver;
    },
    
    /*findUser : function findUser(userID) {
        console.info("travelServiceMock: findUser");
        var user = partyService.findAllUsers().find(function(user) {
            return user.id == userID;
        }); 
        return user;
    },
    
    createATravel : function createATravel(driverSearchDTO) {
        console.info("travelServiceMock: createATravel");
        travelID = global.incrementID(travelID);
        var aTravel = new travelModel.Travel(travelID, driverSearchDTO.from, driverSearchDTO.to);
        aTravel.petAmountSmall = driverSearchDTO.petAmountSmall;
        aTravel.petAmountMedium = driverSearchDTO.petAmountMedium;
        aTravel.petAmountLarge = driverSearchDTO.petAmountLarge;
        aTravel.hasACompanion = driverSearchDTO.hasACompanion;
        aTravel.userID = driverSearchDTO.userID;
        aTravel.distance = haversine(driverSearchDTO.from, driverSearchDTO.to);
        aTravel.time = aTravel.distance / process.env.TIME_PER_KM;
        aTravel.price = 0;
        aTravel.price += aTravel.distance * process.env.PRICE_PER_KM;
        aTravel.price += aTravel.time * process.env.PRICE_PER_MINUTE;
        if (!aTravel.petAmountSmall) aTravel.petAmountSmall = 0;
        if (!aTravel.petAmountMedium) aTravel.petAmountMedium = 0;
        if (!aTravel.petAmountLarge) aTravel.petAmountLarge = 0;
        aTravel.price += (aTravel.petAmountSmall + aTravel.petAmountMedium +  aTravel.petAmountLarge) * process.env.PRICE_PER_PET;
        if (aTravel.hasACompanion) aTravel.price += process.env.PRICE_COMPANION;

        var date = new Date();
        var current_hour = date.getHours();

        if (process.env.MAX_HOUR_NIGHT > process.env.MIN_HOUR_NIGHT){
            if (current_hour >= process.env.MIN_HOUR_NIGHT && current_hour < process.env.MAX_HOUR_NIGHT){
                aTravel.price += aTravel.price*process.env.PERCENTAGE_NIGHT_PRICE;
            }
        }else{
            if ((current_hour >= process.env.MIN_HOUR_NIGHT && current_hour < 0) || (current_hour >= 0 && current_hour <= process.env.MIN_HOUR_NIGHT)){
                aTravel.price += aTravel.price*process.env.PERCENTAGE_NIGHT_PRICE;
            } 
        }
        
        var cotizatedStatus = travelModel.getAllStates().get(1);
        aTravel.states.push(cotizatedStatus);
        if (!travels.has(travelID)) {
            travels.set(travelID, aTravel);
        }
        return aTravel;
    },
    
    findTravelByTravelID : function findTravelByTravelID(travelID) {
        console.info("travelServiceMock :" + "findTravelByTravelID. travelID : " + travelID);
        var aTravel = null;
        if (travels.has(travelID)) {
            aTravel = travels.get(travelID);
        }
        return aTravel;
    },
    
    confirmTravel : function confirmTravel(travelID) {
        // logica de mandar el emit al chofer
        console.info("travelServiceMock :" + "confirmTravel. travelID : " + travelID);
        var aTravel = this.findTravelByTravelID(travelID)
        var driverConfirmatedStatus = travelModel.getAllStates().get(3);
        aTravel.states.push(driverConfirmatedStatus);
        return aTravel;
    },

    finalizeTravel : function finalizeTravel(travelID) {
        console.info("travelServiceMock :" + "finalizeTravel. travelID : " + travelID);
        var aTravel = this.findTravelByTravelID(travelID)
        if (aTravel != null) {
            var finalizeStatus = travelModel.getAllStates().get(4);
            aTravel.states.push(finalizeStatus);
        }
        return aTravel;
    },*/

}
