const UserScore = require('../models').UserScore;

module.exports = {
    create(req, res) {
        return UserScore
        .create({
            id: req.body.id,
            fromId: req.body.fromId,
            toId: req.body.toId,
            value: req.body.value,
            comments: req.body.comments
        })
        .then(userScore => res.status(201).send(userScore))
        .catch(error => res.status(400).send(error));
    },

    list(req, res) {
        return UserScore
        .findAll()
        .then((userScores) => res.status(200).send(userScores))
        .catch(error => res.status(400).send(error.message));
    },

    retrieve(req, res){},

    update(req, res){},

    destroy(req, res){},
}
