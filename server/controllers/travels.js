const partyServiceMock =  require('../mock/mockData/partyServiceMock');


const Op = require('../models/index').Sequelize.Op;
const Travel = require('../models/').Travel;
const Address = require('../models').Address;

/**
 * contains all sockets of all users and drivers
 */
var allSockets = require("../../bin/www");
const TRAVEL_QUOTED = 'cotizado';
const TRAVEL_ACCEPTED_BY_USER = 'pendiente';
const TRAVEL_ACCEPTED_BY_DRIVER = 'en viaje';
const TRAVEL_COMPLETED = "finalizado";
const TRAVEL_CANCELED_BY_USER = "cancelado por usuario";
const TRAVEL_CANCELED_BY_DRIVER = "cancelado por chofer";
const VALUE_BY_DRIVER_CANCELED_TRAVEL = 0;
const COMMENT_BY_DRIVER_CANCELED_TRAVEL = "El viaje fue cancelado por el chofer";
const travelDTO = require('../dtos/request/travelDTO');
const DriverScore = require('../models').DriverScore;
const Driver = require('../models').Driver;
var partyDTOModel = require("../dtos/request/partyDTO");
var managerTravelRequest = require('./travelRequestManagerService');
const statusAvailable = "disponible";


/**
 * map when storage response of the drivers
 * contain <idTravel,boolean>
 */
/*responseOfDriverToTravels = new Map();
exports.responseOfDriverToTravels = responseOfDriverToTravels;*/

/**
 * is reemplace for a service that found travels, users, drivers
 * of the DB
 */
travelService = require("../mock/travelServiceMock");


/*//<key,value> = <travelId,{status:100, message:"message"}>
var responseEndTravelToUser = new Map();*/


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
                fromId: req.body.fromId,
                toId: req.body.toId,
                userId: req.body.userId
            })
            .then(travel => res.status(201).send(travel))
            .catch(error => res.status(400).send(error.message));
    },

    list(req, res) {
        console.log('Find all');
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

    findByPk(req, res) {
        console.log('Find By PK: ' + req.query.travelId);
        return Travel
        .findByPk(req.query.travelId, {
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
            if (!travel) {
                return res.status(404).send({
                    message: 'Travel Not Found',
                });
            }
            return res.status(200).send(travel);
        })
        .catch(error => res.status(400).send(error));
    },

    retrieve(req, res) {
        console.log('Request find by query params: ' + JSON.stringify(req.query));
        if (Object.keys(req.query).length > 0) {
            var travelId = (!!req.query.travelId);
            var hasStartDate = (!!req.query.startDate);
            var hasEndDate = (!!req.query.endDate);
            var hasStatus = (!!req.query.status);
            var hasUserId = (!!req.query.userId);
            var hasDriverId = (!!req.query.driverId);
            if (travelId) {
                return Travel
                .findByPk(req.query.travelId, {
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
                    if (!travel) {
                        return res.status(404).send({
                            message: 'Travel Not Found',
                        });
                    }
                    return res.status(200).send(travel);
                })
                .catch(error => res.status(400).send(error));
            } else if (hasStartDate && hasEndDate && hasStatus && hasUserId && hasDriverId) {
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
                            ],
                            where: { createdAt:  {[Op.between]:  [req.query.startDate,req.query.endDate]},
                                    status: req.query.status,
                                    driverId: req.query.driverId,
                                    userId: req.query.userId}
                        })
                        .then((travels) => res.status(200).send(travels))
                        .catch(error => res.status(400).send(error.message));
            } else if (hasStartDate && hasEndDate) {
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
                            ],
                            where: { createdAt:  {[Op.between]:  [req.query.startDate,req.query.endDate]}}
                        })
                        .then((travels) => res.status(200).send(travels))
                        .catch(error => res.status(400).send(error.message));
            } else if (hasStartDate) {
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
                            ],
                            where: { createdAt:  {[Op.gte]:  req.query.startDate}}
                        })
                        .then((travels) => res.status(200).send(travels))
                        .catch(error => res.status(400).send(error.message));
            } else if (hasEndDate) {
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
                            ],
                            where: { createdAt:  {[Op.lte]:  req.query.endDate}}
                        })
                        .then((travels) => res.status(200).send(travels))
                        .catch(error => res.status(400).send(error.message));
            } else if (hasStatus) {
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
                            ],
                            where: {status: req.query.status}
                        })
                        .then((travels) => res.status(200).send(travels))
                        .catch(error => res.status(400).send(error.message));
            } else if (hasDriverId) {
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
                            ],
                            where: {driverId: req.query.driverId}
                        })
                        .then((travels) => res.status(200).send(travels))
                        .catch(error => res.status(400).send(error.message));
            } else if (hasUserId) {
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
                            ],
                            where: {userId: req.query.userId}
                        })
                        .then((travels) => res.status(200).send(travels))
                        .catch(error => res.status(400).send(error.message));
            } else {
                res.status(412).send("Precondition Failed");
            }
        } else {
            console.log('Find all');
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
        }
    },

    getTravelStatus(req, res){
        return Travel
            .findByPk(req.params.travelId, {
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
                if (!travel) {
                    return res.status(404).send({
                        message: 'Travel Not Found',
                    });
                }
                travel.getDriverDistanceToDestiny()
                .then( newTravelStatus => {
                    res.status(200).send(newTravelStatus);
                })
                .catch(error => res.status(500).send(error.message));
            })
            .catch(error => res.status(500).send(error));
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
                    .then((travel) => res.status(200).send(travel))
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
                travel.quote().then(travelPrice => {
                    travel.update({
                            price: travelPrice
                        })
                        .then((travel) => res.status(200).send({ quote: travelPrice }))
                        .catch(error => res.stauts(400).send(error.message));
                });
            })
            .catch(error => res.status(400).send(error));
    },

    simulateQuote(req, res) {
        var travel = Travel.build({
            status: TRAVEL_QUOTED,
            smallPetQuantity: req.body.smallPetQuantity,
            mediumPetQuantity: req.body.mediumPetQuantity,
            bigPetQuantity: req.body.bigPetQuantity,
            price: 0,
            hasCompanion: req.body.hasCompanion,
            userId: req.body.userId
        });

        Address.create({
                latitude: req.body.from.latitude,
                longitude: req.body.from.longitude
        })
        .then(from => {
            Address.create({
                    latitude: req.body.to.latitude,
                    longitude: req.body.to.longitude
                })
                .then(to => {
                    travel.from = from;
                    travel.to = to;
                    travel.fromId = from.id;
                    travel.toId = to.id;
                    travel.quote().then(travelPrice => {
                        travel.price = Math.round(travelPrice);;
                        travel.save()
                            .then(travel => res.status(200).send(travel))
                            .catch(error => {
                                console.log(error.message);
                                res.status(500).send(error);
                            });
                    }).catch(error => {
                        console.log(error.message);
                        res.status(500).send(error);
                    });
                })
                .catch(error => {
                    console.log(error.message);
                    res.status(500).send(error);
                });
        })
        .catch(error => {
            console.log(error.message);
            res.status(500).send(error);
        });
    },

    confirmation(req, res) {
        console.info("===========> Llega una confirmación <===============");
        var aTravelConfirmationRequestDTO = new travelDTO.TravelConfirmationRequestDTO(req.body);

        if (aTravelConfirmationRequestDTO.role == "user") {
            Travel
            .findByPk(aTravelConfirmationRequestDTO.travelId)
            .then(travel => {
                Travel.update({ "status": TRAVEL_ACCEPTED_BY_USER }, { where: { "id": travel.id } });
                managerTravelRequest.manageTravelRequest(aTravelConfirmationRequestDTO.travelId)
                .then((travel) => {
                    try {
                        var aTravelConfirmationResponseDTO = new travelDTO.TravelConfirmationResponseDTO();
                        aTravelConfirmationResponseDTO.travelId = aTravelConfirmationRequestDTO.travelId;
                        aTravelConfirmationResponseDTO.time = "" //travel.time;

                        /*hay que reemplazar el find user*/
                        aTravelConfirmationResponseDTO.driver = travelService.findDriver(travel.driverId);
                        aTravelConfirmationResponseDTO.user = travelService.findUser(travel.userId);
                        res.status(200).send(aTravelConfirmationResponseDTO);
                    } catch (error) {
                        res.status(500).send(error);
                    }
                })
                .catch((value) => {
                    console.log("respuesta de manager: " + value);
                    res.status(400).send({ status: 400, message: "No hay choferes en este momento" });
                })
            })
            .catch(error => { throw error });
        }
        if (aTravelConfirmationRequestDTO.role == "driver") {

            var travelId = aTravelConfirmationRequestDTO.travelId;
            if (!aTravelConfirmationRequestDTO.accept) {
                console.log("----------------- travel is rejected ------------------");
                managerTravelRequest.addResponse(travelId, false);
                res.status(200).send({ status: 200, message: "viaje rechazado correctamente" });
            } else {
                console.log("----------------- travel is accepted ------------------");
                managerTravelRequest.addResponse(travelId, true);

                Travel.findByPk(travelId)
                .then((travel) => {
                    Travel.update({ "status": TRAVEL_ACCEPTED_BY_DRIVER }, { where: { "id": travel.id } });
                    var aTravelConfirmationResponseDTO = new travelDTO.TravelConfirmationResponseDTO();
                    aTravelConfirmationResponseDTO.travelId = travelId;
                    aTravelConfirmationResponseDTO.time = "";
                    aTravelConfirmationResponseDTO.user = travelService.findUser(travel.userId);


                    console.log("$$$$$$$$$$: "+JSON.stringify(aTravelConfirmationResponseDTO));

                    //add distance and time
                    res.status(200).send(aTravelConfirmationResponseDTO);
                })
                .catch((err => res.status(500).send(err)));
            }
        }
    },

    /*
        PRE CONDITION: This endpoint is used only for drivers, when finalized their travels
    */
    finalize(req, res) {
        try {
            console.log("finalize body: " + JSON.stringify(req.body));
            Travel
                .findByPk(req.body.travelId)
                .then(travel => {
                    if (travel != null) {
                        Travel.update({ "status": TRAVEL_COMPLETED }, { where: { "id": travel.id } });
                        console.log("travel data: " + JSON.stringify(travel));
                        console.log("Travel update right");
                        let driverId = req.body.id;
                        Driver.findByPk(driverId)
                        .then(driver => {
                            driver.update({
                                    status: statusAvailable
                            });
                            return res.status(200).send(JSON.stringify({ status: 200, message: "Finalized ok" }));
                        })
                    } else {
                        return res.status(203).send(JSON.stringify({ status: 203, message: "There not exists travel" }));
                    }
                })
                .catch(error => { throw error });

        } catch (e) {
            console.error(e);
            return res.status(500).send(e);
        }
    },

    cancel(req, res) {
        try {
            console.log("///////////CANCEL////: " + req.body);
            console.log("cancel body: " + JSON.stringify(req.body));
            var aTravelCancelRequestDTO = new travelDTO.TravelCancelRequestDTO(req.body);
            if (aTravelCancelRequestDTO.role == 'user') {
                /*try {
                    if (connectionDrivers != undefined  ) {
                        console.log("tamaño del map de sockets drivers: " + connectionDrivers.size)
                        aConnectionDriver = connectionDrivers.values().next().value;
                        //aConnectionDriver = connectionDrivers.get(aTravelCancelRequestDTO.id)
                    }
                } catch (err) {
                    console.error(err);
                }
                if (aConnectionDriver == null || aConnectionDriver == undefined) {
                    console.error("There are no Drivers");
                    return res.status(203).send({ status: 203, message: "There are not Drivers" });
                } else {
                    console.info("Available Driver");
                    Travel
                        .findByPk(aTravelCancelRequestDTO.travelId)
                        .then(travel => {
                            Travel.update({ "status": TRAVEL_CANCELED_BY_USER }, { where: { "id": travel.id } })
                                .then(travel => {
                                    console.log("Travel update right");
                                    aConnectionDriver.socket.emit("NOTIFICATION_CANCELED_OF_TRAVEL", { message: "Canceled by User ok" });
                                    return res.status(200).send({ status: 200, message: "Canceled by User ok" });
                                })
                                .catch(error => { throw error });
                        })
                        .catch(error => { throw error });
                }*/
            } else if (aTravelCancelRequestDTO.role == 'driver') {
                Travel
                    .findByPk(req.body.travelId)
                    .then(travel => {
                        if (travel != null) {
                            Travel.update({ "status": TRAVEL_CANCELED_BY_DRIVER }, { where: { "id": travel.id } });
                            console.log("travel data: " + travel);
                                console.log("Travel update right");

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
                                            Driver.update({ totalScore: newTotalScore, scoreQuantity: newScoreQuantity, status: statusAvailable },
                                                 { where: { 'id': driver.id } })
                                            return res.status(200).send({ status: 200, message: "Canceled by Driver ok" });
                                        })
                                        .catch(error => { throw error });
                                })
                        } else {
                            return res.status(203).send(JSON.stringify({ status: 203, message: "There not exists travel" }));
                        }
                    })
                    .catch(error => { throw error });
            } else {
                return res.status(412).send(new Error("Precondition failed"));
            }
        } catch (error) {
            console.error(error);
            res.status(500).send(error);
        }
    }
}