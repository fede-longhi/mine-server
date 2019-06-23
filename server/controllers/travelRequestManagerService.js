var allSockets = require("../../bin/www");
var haversine = require("haversine");
var travelDTOModel = require("../dtos/request/travelDTO");
var driversMock = require("../mock/mockData/partyServiceMock");
var partyService = require("../mock/mockData/partyServiceMock");

require("custom-env").env("pmm");
const Travel = require('../models/').Travel;
const Driver = require("../models").Driver;
const Address = require("../models").Address;
const IS_MOCK = process.env.IS_MOCK === "true";
const statusInTravel = "en viaje";

//to obtain the response of driver
var travelService = require("../mock/travelServiceMock");

//to save response of driver to travel
var responseOfDriverToTravels = new Map();


var travelsToDrivers = require("../../server/controllers/drivers").travelsToDrivers;

const aTravelMock = {
    "driverId": 0,
    "from": { "latitude": -34.69, "longitude": -58.434 },
    "hasACompanion": true,
    "petAmountLarge": 1,
    "petAmountMedium": 1,
    "petAmountSmall": 0,
    "to": { "latitude": -34.5886603, "longitude": -58.4391604 },
    "travelId": 0,
    "userId": 0
};

function addResponse(idDriver, response) {
    try {
        responseOfDriverToTravels.set(idDriver, response);
        return 0;
    } catch (error) {
        console.log("error in response driver storage: " + error);
        return -1;
    }
}


function manageTravelRequest(travelId) {
    console.log("######### ###########  ###########");
    console.log("#########   INICIO     ###########");
    console.log("######### ###########  ###########");

    if (IS_MOCK) {
        console.log("######### ############### ###########");
        console.log("######### Esto es un Mock ###########");
        console.log("######### ############### ###########");
    }

    return new Promise((resolve, reject) => {
        var radiusA = 2000;
        var radiusB = 4000;
        var radiusC = 8000;
        var allRadius = [radiusA, radiusB, radiusC];
        var radiusSelected;
        var excludedDrivers = new Array();
        var indexRadius = 0;
        var amountDriversNotified = 0;
        var MAXDRIVERSNOTIFICATIONS = 3
        var AMOUNT_BUCLES_TO_WAIT = 10;
        var TIME_TO_WAIT = 3000; //2 seconds
        var REJECT_ERROR = 0;
        var REJECT_DRIVER_REQUEST = 1;
        var REJECT_TIMEOUT = 2;
        var REJECT_DRIVER_NO_FOUND = 3;
        var RESOLVE_DRIVER_ACCEPT = 4;

        function bucleFunction(indexRadius, amountDriversNotified) {

            return new Promise((resolveBucle, rejectBucle) => {
                //select radius
                radiusSelected = allRadius[indexRadius];
                console.log("========= iniciando nueva búsqueda ==========");
                console.log("RADIO ELEGIDO: " + radiusSelected);
                console.log("CHOFERES NOTIFICADOS: " + amountDriversNotified);
                console.log("=============================================");

                console.log('travelID FindByPK : ' + travelId);
                Travel
                .findByPk(travelId, {
                    include: [{
                            model: Address,
                            as: 'from'
                        },
                        {
                            model: Address,
                            as: 'to'
                        }
                    ]
                })
                .then(aTravel => {
                    //obtain best driver
                    var aDriverSelected = null;
                    aDriverSelected = findBestDriver(travelId, radiusSelected, excludedDrivers,aTravel);

                    if (aDriverSelected != null) {
                        console.log("se ha encontrado al mejor chofer con id: " + aDriverSelected.id);

                        console.info("Datos del viaje: " + JSON.stringify(aTravel));

                        // build DTO for driver
                        var aTravelNotificationDTO = new travelDTOModel.TravelNotificationDTO();
                        aTravelNotificationDTO.travelId = aTravel.id;

                        if (IS_MOCK) {
                            aTravelNotificationDTO.from = aTravelMock.from;
                            aTravelNotificationDTO.to = aTravelMock.to;
                        } else {
                            aTravelNotificationDTO.from = aTravel.from;
                            aTravelNotificationDTO.to = aTravel.to;
                        }

                        aTravelNotificationDTO.smallPetQuantity = aTravel.smallPetQuantity;
                        aTravelNotificationDTO.mediumPetQuantity = aTravel.mediumPetQuantity;
                        aTravelNotificationDTO.bigPetQuantity = aTravel.bigPetQuantity;
                        aTravelNotificationDTO.hasCompanion = aTravel.hasCompanion;

                        //notify to driver
                        travelsToDrivers.set(aDriverSelected.id,aTravelNotificationDTO);
                        console.info("Se notificó el viaje al Chofer");

                        //map donde se almacenan las respuestas de los choferes
                        console.log("Esperando la respuesta del chofer....");

                        function waitResponseDriver(amountIterations) {
                            return new Promise((resolveTimeout, rejectTimeout) => {
                                setTimeout(() => {
                                    console.log("======= esperando " + amountIterations * TIME_TO_WAIT + " ms ========");

                                    if (amountIterations <= 0) {
                                        //Timeout
                                        //add driver to exlude drivers
                                        excludedDrivers.push(aDriverSelected.id);
                                        resolveTimeout(REJECT_TIMEOUT);
                                    } else {
                                        console.log("evaluando si responde el chofer ");
                                        console.log("responses DRIVER algotirmo: " + JSON.stringify(responseOfDriverToTravels));
                                        console.log("travel id buscado: " + travelId);
                                        if (responseOfDriverToTravels.has(travelId)) {
                                            console.log("el chofer respondió");
                                            amountIterations = 0;
                                            var response = responseOfDriverToTravels.get(travelId);
                                            responseOfDriverToTravels.delete(travelId);
                                            if (response) {
                                                console.log("el chofer ACEPTO EL VIAJE");
                                                resolveTimeout(RESOLVE_DRIVER_ACCEPT);
                                            } else {
                                                //agregar el chofer para excluirlo de la búsqueda
                                                //seguir buscando otros choferes
                                                console.log("el chofer RECHAZO");
                                                excludedDrivers.push(aDriverSelected.id);
                                                resolveTimeout(REJECT_DRIVER_REQUEST);
                                            }
                                        } else {
                                            //si aún no responde seguir iterando
                                            console.log("El chofer aún no RESPONDE");
                                            waitResponseDriver(--amountIterations)
                                            .then((dataResponse) => {
                                                resolveTimeout(dataResponse);
                                            })
                                        }
                                    }
                                }, TIME_TO_WAIT);

                            });
                        }

                        //llamando a waitResponseDriver por primera vez
                        waitResponseDriver(AMOUNT_BUCLES_TO_WAIT)
                        .then((dataResponse) => {
                            if (dataResponse == RESOLVE_DRIVER_ACCEPT) {
                                console.log("El ciclo terminó y el chofer aceptó el viaje");
                                resolveBucle(aDriverSelected);
                            } else {
                                if (dataResponse == REJECT_DRIVER_REQUEST)
                                    console.log("El ciclo terminó y el chofer rechazó el viaje");

                                if (dataResponse == REJECT_TIMEOUT)
                                    console.log("El ciclo terminó y el chofer no contestó");

                                if (amountDriversNotified >= MAXDRIVERSNOTIFICATIONS || indexRadius >= allRadius.length - 1) {
                                    console.log("===  se superó el radio o max de rechazos ===");
                                    rejectBucle(REJECT_DRIVER_NO_FOUND);
                                } else {
                                    //keep searching drivers
                                    bucleFunction(indexRadius, ++amountDriversNotified)
                                    .then((value) => {
                                        if (value) {
                                            console.log("se encontró el chofer incrementando el radio a: " + indexRadius);
                                            resolveBucle(value);
                                        }
                                    })
                                    .catch((value) => {
                                        console.log("No se encontró el chofer incrementando el radio a " + indexRadius);
                                        rejectBucle(value)
                                    });
                                }
                            }

                        });

                    } else {
                        //driver not found, increase the radius... se tiene que ver
                        console.log("no se encontró choferes en el radio de búsqueda: " + radiusSelected);
                        if (amountDriversNotified >= MAXDRIVERSNOTIFICATIONS || indexRadius >= allRadius.length - 1) {
                            console.log("===  se superó el radio o max de rechazos ===");
                            rejectBucle(REJECT_DRIVER_NO_FOUND);
                        } else {
                            bucleFunction(++indexRadius, amountDriversNotified)
                            .then((value) => {
                                if (value) {
                                    console.log("se encontró el chofer incrementando el radio a: " + allRadius[indexRadius]);
                                    resolveBucle(value);
                                }
                            })
                            .catch((value) => {
                                console.log("No se encontró el chofer incrementando el radio a " + allRadius[indexRadius]);
                                console.log("codigo de salida de búsqueda =========: " + value);
                                rejectBucle(value);
                            });
                        }
                    }
                }) //end find travel
                .catch(error => {
                    console.log("Error to find travel with id: "+ travelId);
                    console.log(error);
                    throw error;
                });

            }); //end promise
        } //end function


        //llamando a bucleFunction
        bucleFunction(indexRadius, ++amountDriversNotified)
            .then((aDriver) => {
                console.log("<<<<<<<<< saliendo de la búsqueda del chofer y se acepto el viaje");
                //actualizar el viaje asociando al chofer
                console.log(JSON.stringify(aDriver), "   travelID  " + travelId);
                Travel
                    .findByPk(travelId, {
                        include: [{
                                model: Address,
                                as: 'from'
                            },
                            {
                                model: Address,
                                as: 'to'
                            }
                        ]
                    })
                    .then(travel => {
                        travel.update({ driverId: aDriver.id })
                        .then( (travelUpdated) => {
                            Driver.findByPk(aDriver.id)
                            .then(driverToUpdated => {
                                var newTravelAmount = driverToUpdated.travelAmount + 1;

                                Driver.update({ travelAmount: newTravelAmount, status: statusInTravel  },
                                    { where: { 'id': driverToUpdated.id } })
                                    .then(resolve(travelUpdated))
                            })
                            .catch(err => { reject(err) });
                            resolve(travelUpdated);
                        })
                        .catch(err => reject(err));
                    })
            })
            .catch((error) => {
                if (error == REJECT_ERROR) {
                    console.log("<<<<<<<<< saliendo de la búsqueda por un error");
                    reject(error);
                } else if (error == REJECT_DRIVER_NO_FOUND) {
                    console.log("<<<<<<<<<< saliendo de la búsqueda porque no encontró chofer");
                    reject(error);
                } else {
                    console.log("<<<<<<<< saliendo por un error desconocido: " + error);
                }
            })
    });
}




/**
 * @param {travelId to obtain point origin of travel} travelId 
 * @param {radius in meters} searchRadius 
 * @param {drivers excluded for this travel} excludedDrivers 
 */

function findBestDriver(travelId, searchRadius, excludedDrivers, travel) {
    console.log("FIND DRIVER TO TRAVEL: "+JSON.stringify(travel));
    var candidateDrivers = new Array();

    // find optimum driver for user
    // is a map that contain (key,value) -> (driverId, GeographicCoordinate)
    var positionsDrivers = driversMock.allDriversMock;

    if (positionsDrivers == undefined || positionsDrivers == null){
        console.log("hubo un error al evaluar las posiciones de los choferes");
        return null;
    }

    console.log("cantidad de choferes mandando posiciones: " + positionsDrivers.size);
    console.log("BUSCANDO CHOFERES con un RADIO en metros de: " + searchRadius);

    if (IS_MOCK) {
        var from = aTravelMock.from;
        var to = aTravelMock.to;
    } else {
        var from = travel.from;
        var to = travel.to;
    }

    var candidateDrivers = [];

    /*positionsDrivers.forEach((value, key) => {
        distance = haversine(value, from, { unit: 'meter' });
        console.log("latitude Driver: " + value.latitude);
        console.log("longitude Driver: " + value.longitude);
        console.log("latitude origin " + from.latitude);
        console.log("longitude origin " + from.longitude);
        console.log("distancia: " + distance);
        if (distance < searchRadius) {
            //obtain driver to evaluate his score
            console.log("El chofer está dentro del radio de búsqueda");
            var aDriver = travelService.findDriver(key);
            candidateDrivers.push(aDriver);
        }
    });*/
    var allRealDriver = [];
    allRealDriver = partyService.findAllDrivers();
    const statusAvailable = "disponible";

    allRealDriver.forEach((value) => {
        console.log("==================================");
        console.log("id: " + value.id);
        console.log("key: " + value.key);
        console.log("latitude Driver: " + value.latitude);
        console.log("longitude Driver: " + value.longitude);
        console.log("latitude origin " + from.latitude);
        console.log("longitude origin " + from.longitude);

        if(value.longitude != "" && value.latitude != "") {
            distance = haversine(value, from, { unit: 'meter' });
            console.log("distancia: " + distance);
            console.log("STATUS: " + value.status);
            if (distance < searchRadius && value.status == statusAvailable) {
                //obtain driver to evaluate his score
                console.log("El chofer está dentro del radio de búsqueda");
                //var aDriver = travelService.findDriver(key);
                candidateDrivers.push(value);
            }
        }
    });

    console.log("*** terminó la búsqueda de choferes ***");

    if (candidateDrivers.length == 0) {
        console.log("No se encontraron choferes candidatos en el radio: " + searchRadius);
        return null;
    } else {
        console.log("Antes de excluir choferes que rechazaron el viaje hay: " + candidateDrivers.length + " choferes");
    }

    //take out excluded drivers
    if (excludedDrivers != null) {
        excludedDrivers.forEach(driverID => {
            console.log("chofer excluido con id: " + driverID);
            //find index of driver with id
            index = candidateDrivers.findIndex(driver => {
                    return driver.id == driverID;
            })
            //remove driver
            candidateDrivers.splice(index, 1);
        });
    }

    if (candidateDrivers.length == 0) {
        console.log("No queadaron choferes Luego de haber excluir Choferes en el radio de búsqueda: " + searchRadius);
        return null;
    } else {
        console.log("Luego de haber excluido quedaron: " + candidateDrivers.length + " choferes");
    }

    return getBestDriver(candidateDrivers);
}

module.exports = {
    manageTravelRequest: manageTravelRequest,
    addResponse: addResponse,
}

function getBestDriver(candidateDrivers) {
    var bestDriver = null;
    candidateDrivers.forEach(driver => {
        if (bestDriver == null)
            bestDriver = driver;
        else {
            if (bestDriver.priority < driver.priority)
                bestDriver = driver;
            else if (bestDriver.priority === driver.priority &&
                bestDriver.amountTravels <= driver.amountTravels)
                bestDriver = driver;
        }
    });
    return bestDriver;
}
