const UserScore = require('../models').UserScore;
const User = require('../models').User;

module.exports = {
    create(req, res) {
        console.log('Request create user score: ' + JSON.stringify(req.body));
        return UserScore
        .create({
            fromId: req.body.fromId,
            toId: req.body.toId,
            travelId: req.body.travelId,
            value: req.body.value,
            comments: req.body.comments
        })
        .then(userScore => {
            User.findByPk(userScore.toId)
            .then(user => {
                var newTotalScore = user.totalScore + userScore.value;
                var newScoreQuantity = user.scoreQuantity + 1;
                user.update({
                    totalScore: newTotalScore,
                    scoreQuantity: newScoreQuantity
                })
                res.status(201).send(userScore);
            })
        })
        .catch(error => {
            console.log(error.message);
            res.status(400).send(error);
        });
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
