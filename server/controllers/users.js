const User = require('../models').User;
const Party = require('../models').Party;

module.exports = {
    create(req, res) {
        return User
          .create({
            status: req.body.status,
            totalScore: req.body.totalScore,
            scoreQuantity: req.body.scoreQuantity,
            partyId: req.body.partyId
          })
          .then(user => res.status(201).send(user))
          .catch(error => res.status(400).send(error));
    },

    list(req, res) {
        return User
          .findAll({
              include: [{
                model: Party,
                as: 'party',
              }]
          })
          .then((users) => res.status(200).send(users))
          .catch((error) => res.status(400).send(error.message));
    },

    retrieve(req, res){},
    update(req, res){},
    destroy(req, res){},
}
