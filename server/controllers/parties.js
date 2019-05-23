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

    //TODO: bug when using findAll with no attributes. Tries to get partyId column
    list(req, res) {
        return Party
          .findAll()
          .then((parties) => res.status(200).send(parties))
          .catch((error) => res.status(400).send(error.message));
    },

    retrieve(req, res){
      return Party
        .findByPk(req.params.partyId)
        .then(party => {
          if (!party) {
            return res.status(404).send({
              message: 'Party Not Found',
            });
          }
          return res.status(200).send(party);
        })
        .catch(error => res.status(400).send(error));
    },

    update(req, res){
      return Party
      .findByPk(req.params.partyId)
      .then(party => {
        if (!party) {
          return res.status(404).send({
            message: 'Party Not Found',
          });
        }
        return party
          .update({
            dni: req.body.dni || party.dni,
            name: req.body.name || req.body.name,
            phone: req.body.phone || req.body.phone
          })
          .then(() => res.status(200).send(party))  // Send back the updated todo.
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
    },

    destroy(req, res){
      return Party
      .findByPk(req.params.partyId)
      .then(party => {
        if (!party) {
          return res.status(400).send({
            message: 'Party Not Found',
          });
        }
        return party
          .destroy()
          .then(() => res.status(204).send())
          .catch(error => res.status(400).send(error));
      })
      .catch(error => res.status(400).send(error));
    }
}
