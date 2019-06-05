/*require('console-info');
require('console-error');
require('custom-env').env('pmm');*/

var travelModel = require("../dtos/model/travel"),
    partyService = require("./mockData/partyServiceMock"),
    haversine = require('haversine');

var travels = new Map();
var travelId = 0;

module.exports = {
    /*findTravelById : function findTravelById(id) {
        console.info("travelServiceMock: findTravelById");
        var aTravel = null;
        if (travels.has(id)) {
            aTravel = travels.get(id);
        }
        return aTravel;
    },*/

    findDriver: function findDriver(driverID) {
        console.info("travelServiceMock: findDriver " + driverID);
        var driver = partyService.findAllDrivers().find(function(driver) {
            return driver.id == driverID;
        });
        return driver;
    },

    findUser: function findUser(userID) {
        console.info("travelServiceMock: findUser");
        var user = partyService.findAllUsers().find(function(user) {
            return user.id == userID;
        });
        return user;
    }

}