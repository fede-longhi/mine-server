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

    getTravels(req, res) {
        return Travel
        .findAll({
            where: {
                userId: req.params.userId,
            },
            include: [
                {
                    model: Driver,
                    as: 'driver'
                },
                {
                    model: User,
                    as: 'user'
                },
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
        .catch(error => res.status(400).send(error));
    },

    getScoresReceived(req, res) {
        return UserScore
        .findAll({
            where: {
                toId: req.params.userId,
            }
        })
        .then((userScore) => res.status(200).send(userScore))
        .catch(error => res.status(400).send(error));
    },

    getScoresGiven(req, res) {
        return DriverScore
        .findAll({
            where: {
                fromId: req.params.userId,
            }
        })
        .then((driverScore) => res.status(200).send(driveScore))
        .catch(error => res.status(400).send(error));
    }
}