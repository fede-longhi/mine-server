const Travel = require('../models').Travel;
const allSockets = require("../../bin/www");
const TRAVEL_COMPLETED = "completed";
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

    /*
        PRE CONDITION: This endpoint is used only for drivers, when finalized their travels
    */
    finalize(req, res) {
        var aTravelFinalizeRequestDTO = new travelDTO.TravelFinalizeRequestDTO(req.body);
        var connectionUsers = allSockets.connectionUsers;
        var aConnectionUser = null;
        try {
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
                        travel.status = TRAVEL_COMPLETED;
                        travel.update(travel)
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
    }
}