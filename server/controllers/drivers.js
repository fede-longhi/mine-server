const Driver = require('../models').Driver;
const Party = require('../models').Party;

module.exports = {
    create(req, res) {
        return Driver
          .create({
            status: req.body.status,
            licenseNumber: req.body.licenseNumber,
            totalScore: req.body.totalScore,
            scoreQuantity: req.body.scoreQuantity
          })
          .then(driver => res.status(201).send(driver))
          .catch(error => res.status(400).send(error));
    },

    list(req, res) {
        return Driver
          .findAll()
          .then((drivers) => res.status(200).send(drivers))
          .catch((error) => res.status(400).send(error));
    },
}
