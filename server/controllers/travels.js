const Travel = require('../models/').Travel;
const Address = require('../models').Address;

const allSockets = require("../../bin/www");
const TRAVEL_COMPLETED = "completed";
const TRAVEL_CANCELED_BY_USER = "canceled by user";
const TRAVEL_CANCELED_BY_DRIVER = "canceled by driver";
const travelDTO = require('../dtos/request/travelDTO');


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
            include: [
                {
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

    retrieve(req, res){
        return Travel
        .findByPk(req.params.travelId)
        .then(travel => {
            if(!travel){
                return res.status(404).send({
                    message: 'Travel Not Found',
                });
            }
            return res.status(200).send(travel);
        })
        .catch(error => res.status(400).send(error));
    },

    update(req, res){
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

    quote(req, res){
        return Travel.findByPk(req.params.travelId)
        .then(travel =>{
            var travelPrice = travel.quote();
            travel.update({
                price: travelPrice
            })
            .then((travel) => res.status(200).send({quote: travelPrice}))
            .catch(error => res.stauts(400).send(error));
        })
        .catch(error => res.status(400).send(error));
    },

    simulateQuote(req, res){
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
                                .then(travel => {
                                    console.log("Travel update right");
                                    aConnectionUser.socket.emit("NOTIFICATION_CANCELED_OF_TRAVEL", { message: "Canceled by Driver ok" });
                                    return res.status(200).send(JSON.stringify({ status: 200, message: "Canceled by Driver ok" }));
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
