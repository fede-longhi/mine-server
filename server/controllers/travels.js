const Travel = require('../models').Travel;

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

    retrieve(req, res){},
    update(req, res){},
    destroy(req, res){},
}
