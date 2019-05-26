const Travel = require('../models/').Travel;
const Address = require('../models').Address;


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
    }
}
