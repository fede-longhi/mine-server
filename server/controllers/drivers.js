const Driver = require('../models').Driver;
const Party = require('../models').Party;

module.exports = {
  create(req, res) {
    return Driver
      .create({
        status: req.body.status,
        licenseNumber: req.body.licenseNumber,
        totalScore: req.body.totalScore,
        scoreQuantity: req.body.scoreQuantity,
        partyId: req.body.partyId
      })
      .then(driver => res.status(201).send(driver))
      .catch(error => res.status(400).send(error));
  },

  list(req, res) {
    return Driver
      .findAll({
        include: [{
        model: Party,
        as: 'party'
      }]
    })
    .then((drivers) => res.status(200).send(drivers))
    .catch((error) => res.status(400).send(error));
  },

  retrieve(req, res){
    return Driver
      .findByPk(req.params.driverId)
      .then(driver => {
        if (!driver){
          return res.status(400).send({
            message: "Driver not found."
          })
        }
        return res.status(200).send(driver);
      })
      .catch(error => res.status(400).send(error));
  },

  update(req, res){
    return Driver
      .findByPk(req.params.driverId)
      .then(driver => {
        if (!driver) {
          return res.status(404).send({
            message: 'Driver Not Found',
          });
        }
        return driver
          .update({
            status: req.body.status || driver.status,
            licenseNumber: req.body.licenseNumber || driver.licenseNumber,
            totalScore: req.body.totalScore || driver.totalScore,
            scoreQuantity: req.body.scoreQuantity || driver.scoreQuantity,
            partyId: req.body.partyId || driver.partyId
          })
          .then((driver) => res.status(200).send(driver))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },


  destroy(req, res){
    return Driver
        .findByPk(req.params.driverId)
        .then(driver => {
            if (!driver) {
            return res.status(400).send({
                message: 'Driver Not Found',
            });
            }
            return driver
            .destroy()
            .then(() => res.status(204).send())
            .catch(error => res.status(400).send(error));
        })
        .catch(error => res.status(400).send(error));
  },


}
