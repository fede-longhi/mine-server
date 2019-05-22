const Party = require('../models').Party;
const Driver = require('../models').Driver;

module.exports = {
    create(req, res) {
        return Party
          .create({
            name: req.body.name,
            phone: req.body.phone,
            dni: req.body.dni,
          })
          .then(party => res.status(201).send(party))
          .catch(error => res.status(400).send(error));
    },

    list(req, res) {
        return Party
          .findAll()
          .then((parties) => res.status(200).send(parties))
          .catch((error) => res.status(400).send(error));
      },
}
