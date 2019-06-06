/*require('console-info');
require('console-error');*/
require('custom-env').env('pmm');

var travelModel = require("../dtos/model/travel"),
    partyService = require("./mockData/partyServiceMock"),
    haversine = require('haversine');

var travels = new Map();
var travelId = 0;

module.exports = {
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