const User = require('../models').User;
const Party = require('../models').Party;

module.exports = {
    create(req, res) {
        return User
            .create({
                id: req.body.userId,
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

    retrieve(req, res) {
        return User
            .findByPk(req.params.userId)
            .then(user => {
                if (!user) {
                    return res.status(404).send({
                        message: 'User Not Found',
                    });
                }
                return res.status(200).send(user);
            })
            .catch(error => res.status(400).send(error));
    },

    update(req, res) {
        return User
            .findByPk(req.params.userId)
            .then(user => {
                if (!user) {
                    return res.status(404).send({
                        message: 'User Not Found',
                    });
                }
                return user
                    .update({
                        status: req.body.status || user.status,
                        totalScore: req.body.totalScore || user.totalScore,
                        scoreQuantity: req.body.scoreQuantity || user.scoreQuantity,
                        partyId: req.body.partyId || user.partyId
                    })
                    .then((user) => res.status(200).send(user))
                    .catch((error) => res.status(400).send(error));
            })
            .catch((error) => res.status(400).send(error));
    },

    destroy(req, res) {
        return User
            .findByPk(req.params.userId)
            .then(user => {
                if (!user) {
                    return res.status(400).send({
                        message: 'User Not Found',
                    });
                }
                return user
                    .destroy()
                    .then(() => res.status(204).send())
                    .catch(error => res.status(400).send(error));
            })
            .catch(error => res.status(400).send(error));
    },
}