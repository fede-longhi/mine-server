//require('console-info');
//require('console-error');
var party = require("../../dtos/request/partyDTO");
var travel = require("../../dtos/model/travel");
const Driver = require("../../models").Driver;
const Party = require('../../models').Party;
const User = require("../../models").User;

var realDrivers = new Array;

/*exports.findAllDrivers = function findAllDrivers() {
    console.info("partyServiceMock: findAllDrivers");
    if (drivers == null) {
        var driver1 = new party.DriverDTO();
        driver1.id = "987654322";
        driver1.name = "Michael Schumacher";
        driver1.lastName = "Schumacher";
        driver1.license = "999999991";
        driver1.pointsCategory = "0.5";
        driver1.score = "4";
        driver1.prioriry = "4.5";
        driver1.amountTravels = "20";
        var driver2 = new party.DriverDTO();
        driver2.id = "987654321";
        driver2.name = "Juan Manuel Fangio";
        driver2.lastName = "Fangio";
        driver2.license = "999999992";
        driver2.pointsCategory = "0.7";
        driver2.score = "4";
        driver2.prioriry = "4.7";
        driver2.amountTravels = "50";
        var driver3 = new party.DriverDTO();
        driver3.id = "987654399";
        driver3.name = "Lewis Hamilton";
        driver3.lastName = "Hamilton";
        driver3.license = "999999993";
        driver3.pointsCategory = "1";
        driver3.score = "3.7";
        driver3.prioriry = "4.7";
        driver3.amountTravels = "600";
        var drivers = [];
        drivers.push(driver1);
        drivers.push(driver2);
        drivers.push(driver3);
    }
    return drivers;
};*/

exports.findAllDrivers = function findAllDrivers() {
    console.info("partyServiceMock: findAllDrivers");
    if (realDrivers != null) {
        return realDrivers;
    }
};

var allDrivers = new Map();
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

/*
    Agregar 3 choferes reales de la DB.
*/

Driver
    .findAll()
    .then(drivers => {
        var geo = new travel.GeographicCoordenate({ latitude: -34.689, longitude: -58.4345 });
        allDrivers.set(drivers[2].id, geo);
        geo = new travel.GeographicCoordenate({ latitude: -34.691, longitude: -58.4345 });
        allDrivers.set(drivers[1].id, geo);
        geo = new travel.GeographicCoordenate({ latitude: -34.690, longitude: -58.4345 });
        allDrivers.set(drivers[0].id, geo);
        console.log("cantidad de choferes con ID posta de DB : " + allDrivers.size);
        console.log(JSON.stringify(allDrivers, (key, value) => (value instanceof Map ? [...value] : value)));

        exports.allDriversMock = allDrivers;
    })
    .catch((error) => console.log(error));


exports.findAllUsers = function findAllUsers() {
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
};

exports.findAllRealDrivers = function findAllRealDrivers() {
    return new Promise((resolve) =>{
        Driver.findAll({
            include: [{
                model: Party,
                as: 'party'
            }]
        })
        .then((drivers) => {
            var i = 0;
            var total = drivers.length;
            drivers.forEach(element => {
                i++;
                var driver2 = new party.DriverDTO();
                driver2.id = element.id;
                driver2.name = element.party.name;
                driver2.lastName = "";
                driver2.license = element.licenseNumber;
                driver2.pointsCategory = getPointsByAmountTravels(element.travelAmount);
                var scorePromedio = element.totalScore/element.scoreQuantity;
                driver2.score =scorePromedio;
                driver2.prioriry = scorePromedio+driver2.pointsCategory;
                driver2.amountTravels = element.travelAmount;
                realDrivers.push(driver2);
                //console.log(driver2)
                if(i === total){
                    console.log("###########&%/%&$##/&&/(&7");
                    resolve(0);
                }
            });
        })
        .catch((err)=>{
            console.log(err);
            realDrivers = null
        });
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