//require('console-info');
//require('console-error');
var party = require("../../dtos/request/partyDTO");
var travel = require("../../dtos/model/travel");
const Driver = require("../../models").Driver;
const Party = require('../../models').Party;
const User = require("../../models").User;
var realDrivers = new Array;
var realUsers = new Array;
var allDrivers = new Map();

/**
 * Users
 */

/*exports.findAllUsers = function findAllUsers() {
    console.info("partyServiceMock: findAllUsers");
    if (users == null) {
        var user1 = new party.UserDTO();
        user1.id = "123456782";
        user1.name = "Pepe";
        user1.lastName = "Ape";
        var user2 = new party.UserDTO();
        user2.id = "2";
        user2.name = "Mengano";
        user2.lastName = "Ape";
        var user3 = new party.UserDTO();
        user3.id = "3";
        user3.name = "Fulano";
        user3.lastName = "Ape";
        var users = [];
        users.push(user1);
        users.push(user2);
        users.push(user3);
    }
    return users;
};*/

exports.findAllUsers = function findAllUsers() {
    if(realUsers != null)
        return realUsers;
};


exports.loadUsers = function loadUsers(req, res, next) {
    console.log("USER:---------------------------------> ");
    User.findAll({
        include: [{
            model: Party,
            as: 'party'
        }]
    })
    .then((users) => {
        console.log("USER: "+JSON.stringify(users));
        users.forEach(element => {
            var user = new party.UserDTO();
            user.id = element.id;
            user.name = element.party.name;
            realUsers.push(user);
            console.log("USER: "+JSON.stringify(user));
        });
        next();
    })
    .catch((err)=>{
        console.error(err);
        realUsers = null
    });
};


/**
 * Drivers
 */

exports.findAllDrivers = function findAllDrivers() {
    console.info("partyServiceMock: findAllDrivers");
    if (realDrivers != null) {
        return realDrivers;
    }
};

exports.loadDrivers = function loadDrivers(req, res, next) {
    Driver.findAll({
        include: [{
            model: Party,
            as: 'party'
        }]
    })
    .then((drivers) => {
        drivers.forEach(element => {
            var driver = new party.DriverDTO();
            driver.id = element.id;
            driver.name = element.party.name;
            driver.license = element.licenseNumber;
            driver.pointsCategory = getPointsByAmountTravels(element.travelAmount);
            var scorePromedio = element.totalScore/element.scoreQuantity;
            driver.score =scorePromedio;
            driver.prioriry = scorePromedio+driver.pointsCategory;
            driver.amountTravels = element.travelAmount;
            realDrivers.push(driver);
        });
        next();
    })
    .catch((err)=>{
        console.log(err);
        realDrivers = null
    });
};


function getPointsByAmountTravels(amountTravels) {
    const lowCategory = 9;
    const basicCategory = 49;
    const mediumCategory = 99;
    const highCategory = 499;

    const pointsLowCategory = 0.2;
    const pointsBasicCategory = 0.5;
    const pointsMediumCategory = 0.7;
    const pointsHighCategory = 0.9;
    const pointsPremiumCategory = 1;

    if (amountTravels <= lowCategory) {
        return pointsLowCategory;
    } else if (amountTravels <= basicCategory) {
        return pointsBasicCategory;
    } else if (amountTravels <= mediumCategory) {
        return pointsMediumCategory;
    } else if (amountTravels <= highCategory) {
        return pointsHighCategory;
    } else {
        return pointsPremiumCategory;
    }
}

/**
 * Positions Driver
 */

//var geo = new travel.GeographicCoordenate({latitude:-34.6986,longitude:-58.49});
/*var geo = new travel.GeographicCoordenate({latitude:-34.69,longitude:-58.4301});
allDrivers.set(1,geo);
geo = new travel.GeographicCoordenate({latitude:-34.75,longitude:-58.438});
allDrivers.set(2,geo);
geo = new travel.GeographicCoordenate({latitude:-34.3,longitude:-58});
allDrivers.set(3,geo);
console.log("cantidad de elementos mock pos: "+allDrivers.size);*/

//var geo = new travel.GeographicCoordenate({latitude:-34.6986,longitude:-58.49});

/*var geo = new travel.GeographicCoordenate({latitude:-54.69,longitude:-58.4301});
allDrivers.set(1,geo);
geo = new travel.GeographicCoordenate({latitude:-54.75,longitude:-58.438});
allDrivers.set(2,geo);
geo = new travel.GeographicCoordenate({latitude:-54.3,longitude:-58});
allDrivers.set(3,geo);
console.log("cantidad de elementos mock pos: "+allDrivers.size);*/

Driver
.findAll()
.then(drivers => {
    var geo = new travel.GeographicCoordenate({ latitude: -34.689, longitude: -58.4345 });
    allDrivers.set(drivers[2].id, geo);
    geo = new travel.GeographicCoordenate({ latitude: -34.691, longitude: -58.4345 });
    allDrivers.set(drivers[1].id, geo);
    geo = new travel.GeographicCoordenate({ latitude: -34.690, longitude: -58.4345 });
    allDrivers.set(drivers[0].id, geo);
    /*geo = new travel.GeographicCoordenate({ latitude: -34.690, longitude: -58.4345 });
    allDrivers.set(drivers[3].id, geo);
    console.log("cantidad de choferes con ID posta de DB : " + allDrivers.size);*/
    console.log(JSON.stringify(allDrivers, (key, value) => (value instanceof Map ? [...value] : value)));

    exports.allDriversMock = allDrivers;
})
.catch((error) => console.log(error));