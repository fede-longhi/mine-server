const Travel = require('../models/').Travel;
const Address = require('../models').Address;

/**
 * contains all sockets of all users and drivers
 */
allSockets = require("../../bin/www");
const TRAVEL_COMPLETED = "completed";
const TRAVEL_CANCELED_BY_USER = "canceled by user";
const TRAVEL_CANCELED_BY_DRIVER = "canceled by driver";
const VALUE_BY_DRIVER_CANCELED_TRAVEL = 0;
const COMMENT_BY_DRIVER_CANCELED_TRAVEL = "The travel was canceled by driver";
const travelDTO = require('../dtos/request/travelDTO');
const DriverScore = require('../models').DriverScore;
const Driver = require('../models').Driver;
var partyDTOModel = require("../dtos/request/partyDTO");
var managerTravelRequest = require('./travelRequestManagerService');

/**
 * map when storage response of the drivers
 * contain <idTravel,boolean>
 */
responseOfDriverToTravels = new Map();
exports.responseOfDriverToTravels = responseOfDriverToTravels;

/**
 * is reemplace for a service that found travels, users, drivers
 * of the DB
 */
//travelService = require("./mock/travelServiceMock"),

module.exports = {
    create(req, res) {
        return Travel
            .create({
                status: req.body.status,
                smallPetQuantity: req.body.smallPetQuantity,
                mediumPetQuantity: req.body.mediumPetQuantity,
                bigPetQuantity: req.body.bigPetQuantity,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                price: req.body.price,
                hasCompanion: req.body.hasCompanion,
                driverId: req.body.driverId,
                userId: req.body.userId
            })
            .then(travel => res.status(201).send(travel))
            .catch(error => res.status(400).send(error.message));
    },

    list(req, res) {
        return Travel
            .findAll({
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
            .then((travels) => res.status(200).send(travels))
            .catch(error => res.status(400).send(error.message));
    },

    retrieve(req, res) {
        return Travel
            .findByPk(req.params.travelId)
            .then(travel => {
                if (!travel) {
                    return res.status(404).send({
                        message: 'Travel Not Found',
                    });
                }
                return res.status(200).send(travel);
            })
            .catch(error => res.status(400).send(error));
    },

    update(req, res) {
        return Travel
            .findByPk(req.params.travelId)
            .then(travel => {
                if (!travel) {
                    return res.status(404).send({
                        message: 'Travel Not Found',
                    });
                }
                return travel
                    .update({
                        status: req.body.status,
                        smallPetQuantity: req.body.smallPetQuantity,
                        mediumPetQuantity: req.body.mediumPetQuantity,
                        bigPetQuantity: req.body.bigPetQuantity,
                        startDate: req.body.startDate,
                        endDate: req.body.endDate,
                        price: req.body.price,
                        hasCompanion: req.body.hasCompanion,
                        driverId: req.body.driverId,
                        userId: req.body.userId
                    })
                    .then(travel => res.status(201).send(travel))
                    .catch(error => res.status(400).send(error.message));
            })
    },

    list(req, res) {
        return Travel
            .findAll()
            .then((travels) => res.status(200).send(travels))
            .catch(error => res.status(400).send(error.message));
    },

    retrieve(req, res) {
        return Travel
            .findByPk(req.params.travelId)
            .then(travel => {
                if (!travel) {
                    return res.status(404).send({
                        message: 'Travel Not Found',
                    });
                }
                return res.status(200).send(travel);
            })
            .catch(error => res.status(400).send(error));
    },

    update(req, res) {
        return Travel
            .findByPk(req.params.travelId)
            .then(travel => {
                if (!travel) {
                    return res.status(404).send({
                        message: 'Travel Not Found',
                    });
                }
                return travel
                    .update({
                        status: req.body.status,
                        smallPetQuantity: req.body.smallPetQuantity,
                        mediumPetQuantity: req.body.mediumPetQuantity,
                        bigPetQuantity: req.body.bigPetQuantity,
                        startDate: req.body.startDate,
                        endDate: req.body.endDate,
                        price: req.body.price,
                        hasCompanion: req.body.hasCompanion,
                        driverId: req.body.driverId,
                        userId: req.body.userId
                    })
                    .then((travel) => res.status(200).send(travel)) // Send back the updated todo.
                    .catch((error) => res.status(400).send(error));
            })
            .catch((error) => res.status(400).send(error));
    },

    destroy(req, res) {
        return Travel
            .findByPk(req.params.travelId)
            .then(travel => {
                if (!travel) {
                    return res.status(400).send({
                        message: 'Travel Not Found',
                    });
                }
                return travel
                    .destroy()
                    .then(() => res.status(204).send())
                    .catch(error => res.status(400).send(error));
            })
            .catch(error => res.status(400).send(error));
    },

    quote(req, res) {
        return Travel.findByPk(req.params.travelId)
            .then(travel => {
                var travelPrice = travel.quote();
                travel.update({
                        price: travelPrice
                    })
                    .then((travel) => res.status(200).send({ quote: travelPrice }))
                    .catch(error => res.stauts(400).send(error));
            })
            .catch(error => res.status(400).send(error));
    },
    confirmation(req, res) {
        console.info("TravelResource :" + JSON.stringify(req.body));
        var aTravelConfirmationRequestDTO = new travelDTO.TravelConfirmationRequestDTO(req.body);
        console.log("####message confirmation###: " + JSON.stringify(aTravelConfirmationRequestDTO));
        var connectionUsers = allSockets.connectionUsers;
        var connectionDrivers = allSockets.connectionDrivers;
        var aConnectionDriver = null;
        if (aTravelConfirmationRequestDTO.rol == "USER") {

            console.log("----solicitud de viaje----");
            //res.status(200).send({status:200, message: "su chofer está en camino"});
            // launch thread
            /***
             * Este comentario es sólo para mockear
             */
            managerTravelRequest.manageTravelRequest(aTravelConfirmationRequestDTO.travelID)
                .then((value) => {
                    console.log("respuesta de manager: " + value);
                    res.status(200).send({ status: 200, message: "su chofer está en camino" });
                })
                .catch((value) => {
                    console.log("respuesta de manager: " + value);
                    res.status(400).send({ status: 400, message: "No hay choferes en este momento" });
                })
        }
        var aConnectionUser = null;
        if (aTravelConfirmationRequestDTO.rol == "DRIVER") {
            //if travel is rejected
            if (!aTravelConfirmationRequestDTO.accept) {
                console.log("------------------ travel is rejected ------------------");
                responseOfDriverToTravels.set(aTravelConfirmationRequestDTO.travelID, false);
                res.status(200).send({ status: 200, message: "viaje rechazado correctamente" });
            } else {
                //travel is accepted
                responseOfDriverToTravels.set(aTravelConfirmationRequestDTO.travelID, true);
                console.log("------------------ travel is accepted ------------------");
                /**
                 * HARCODEOOOOOO
                 * para probar desde postman
                 */
                //res.status(200).send({status:200, message:"viaje aceptado correctamente"});

                //notify to user
                try {
                    if (connectionUsers != undefined) {
                        aConnectionUser = connectionUsers.values().next().value;
                    }
                } catch (err) {
                    console.error(err);
                    res.status(400).send({ status: 400, message: "error inesperado" });
                }
                if (aConnectionUser == null || aConnectionUser == undefined) {
                    console.error("There are no Users");
                    res.status(204).send({ status: 204, message: "There are not Users" });
                } else {
                    console.info("Available User");
                    // logica de mandar el emit al chofer
                    //var aTravel = travelService.findTravelByTravelID(aTravelConfirmationRequestDTO.travelID);
                    try {
                        //var aTravel = travelService.confirmTravel(aTravelConfirmationRequestDTO.travelID);
                        //aTravel.driverID = aTravelConfirmationRequestDTO.id;
                        var aTravelConfirmationResponseDTO = new travelDTO.TravelConfirmationResponseDTO();
                        aTravelConfirmationResponseDTO.travelID = /*aTravel.travelID;*/ "0";
                        aTravelConfirmationResponseDTO.time = /*Math.round(aTravel.time);*/ "123";
                        aTravelConfirmationResponseDTO.driver = /*travelService.findDriver(aTravel.driverID);*/ "123";

                        console.log("lo que se va mandar al usuario: " + JSON.stringify(aTravelConfirmationResponseDTO));

                        aConnectionUser.socket.emit("NOTIFICATION_OF_TRAVEL", aTravelConfirmationResponseDTO);

                        console.log("Se mandó al usuario ");

                        aTravelConfirmationResponseDTO.driver = null;
                        aTravelConfirmationResponseDTO.user = /*travelService.findUser(aTravel.userID);*/ "123";
                        aTravelConfirmationResponseDTO
                        res.status(200).send(aTravelConfirmationResponseDTO);
                    } catch (error) {
                        res.status(500).send(error);
                    }
                }
            }
        }

    },

    simulateQuote(req, res) {
        var travel = Travel.build({
            status: 'quoted',
            smallPetQuantity: req.body.smallPetQuantity,
            mediumPetQuantity: req.body.mediumPetQuantity,
            bigPetQuantity: req.body.bigPetQuantity,
            price: 0,
            hasCompanion: req.body.hasCompanion,
            userId: req.body.userId,
            fromId: req.body.fromId,
            toId: req.body.toId
        });
        var travelPrice = travel.quote();
        travel.price = travelPrice;
        travel.save()
            .then(travel => res.status(200).send(travel))
            .catch(error => res.status(400).send(error.message));
    },

    /*
        PRE CONDITION: This endpoint is used only for drivers, when finalized their travels
    */
    finalize(req, res) {
        try {
            var aTravelFinalizeRequestDTO = new travelDTO.TravelFinalizeRequestDTO(req.body);
            var connectionUsers = allSockets.connectionUsers;
            var aConnectionUser = null;
            try {
                if (connectionUsers != undefined && connectionUsers.has(aTravelFinalizeRequestDTO.id)) {
                    aConnectionUser = connectionUsers.get(aTravelFinalizeRequestDTO.id)
                }
            } catch (err) {
                console.error(err);
            }
            if (aConnectionUser == null || aConnectionUser == undefined) {
                console.error("There are no Users");
                return res.status(203).send(JSON.stringify({ status: 203, message: "There are not Users" }));
            } else {
                console.info("Available User");
                Travel
                    .findByPk(aTravelFinalizeRequestDTO.travelId)
                    .then(travel => {
                        Travel.update({ "status": TRAVEL_COMPLETED }, { where: { "id": travel.id } })
                            .then(travel => {
                                console.log("Travel update right");
                                aConnectionUser.socket.emit("NOTIFICATION_FINALIZED_OF_TRAVEL", { message: "Finalized ok" });
                                return res.status(200).send(JSON.stringify({ status: 200, message: "Finalized ok" }));
                            })
                            .catch(error => { throw error });
                    })
                    .catch(error => { throw error });
            }
        } catch (error) {
            console.error(error);
            res.status(500).send(error);
        }
    },

    cancel(req, res) {
        try {
            var aTravelCancelRequestDTO = new travelDTO.TravelCancelRequestDTO(req.body);
            var connectionUsers = allSockets.connectionUsers;
            var connectionDrivers = allSockets.connectionDrivers;
            var aConnectionUser = null;
            var aConnectionDriver = null;
            if (aTravelCancelRequestDTO.role == 'user') {
                try {
                    if (connectionDrivers != undefined && connectionDrivers.has(aTravelCancelRequestDTO.id)) {
                        aConnectionDriver = connectionDrivers.get(aTravelCancelRequestDTO.id)
                    }
                } catch (err) {
                    console.error(err);
                }
                if (aConnectionDriver == null || aConnectionDriver == undefined) {
                    console.error("There are no Drivers");
                    return res.status(203).send(JSON.stringify({ status: 203, message: "There are not Drivers" }));
                } else {
                    console.info("Available Driver");
                    Travel
                        .findByPk(aTravelCancelRequestDTO.travelId)
                        .then(travel => {
                            Travel.update({ "status": TRAVEL_CANCELED_BY_USER }, { where: { "id": travel.id } })
                                .then(travel => {
                                    console.log("Travel update right");
                                    aConnectionDriver.socket.emit("NOTIFICATION_CANCELED_OF_TRAVEL", { message: "Canceled by User ok" });
                                    return res.status(200).send(JSON.stringify({ status: 200, message: "Canceled by User ok" }));
                                })
                                .catch(error => { throw error });
                        })
                        .catch(error => { throw error });
                }
            } else if (aTravelCancelRequestDTO.role == 'driver') {
                try {
                    if (connectionUsers != undefined && connectionUsers.has(aTravelCancelRequestDTO.id)) {
                        aConnectionUser = connectionUsers.get(aTravelCancelRequestDTO.id)
                    }
                } catch (err) {
                    console.error(err);
                }
                if (aConnectionUser == null || aConnectionUser == undefined) {
                    console.error("There are no Users");
                    return res.status(203).send(JSON.stringify({ status: 203, message: "There are not Users" }));
                } else {
                    console.info("Available User");
                    Travel
                        .findByPk(aTravelCancelRequestDTO.travelId)
                        .then(travel => {
                            Travel.update({ "status": TRAVEL_CANCELED_BY_DRIVER }, { where: { "id": travel.id } })
                            console.log("Travel update right");
                            aConnectionUser.socket.emit("NOTIFICATION_CANCELED_OF_TRAVEL", { message: "Canceled by Driver ok" });
                            DriverScore
                                .create({
                                    fromId: travel.userId,
                                    toId: travel.driverId,
                                    travelId: travel.id,
                                    value: VALUE_BY_DRIVER_CANCELED_TRAVEL,
                                    comments: COMMENT_BY_DRIVER_CANCELED_TRAVEL
                                })
                                .then(driverScore => {
                                    Driver.findByPk(driverScore.toId)
                                        .then(driver => {
                                            var newTotalScore = driver.totalScore + driverScore.value;
                                            var newScoreQuantity = driver.scoreQuantity + 1;
                                            driver.update({
                                                totalScore: newTotalScore,
                                                scoreQuantity: newScoreQuantity
                                            })
                                            return res.status(200).send(JSON.stringify({ status: 200, message: "Canceled by Driver ok" }));
                                        })
                                        .catch(error => { throw error });
                                })
                                .catch(error => { throw error });

                        })
                        .catch(error => { throw error });
                }
            } else {
                return res.status(412).send({ status: 412, message: "Precondition failed" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).send(error);
        }
    }
}