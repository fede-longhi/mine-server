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
            .then((travel) => res.status(200).send(travel))  // Send back the updated todo.
            .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
    },

    destroy(req, res){
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
}
