const DriverScore = require('../models').DriverScore;
const Driver = require('../models').Driver;

module.exports = {
    create(req, res) {
        return DriverScore
        .create({
            id: req.body.id,
            fromId: req.body.fromId,
            toId: req.body.toId,
            travelId: req.body.travelId,
            value: req.body.value,
            comments: req.body.comments
        })
        .then(driverScore => {
            Driver.findByPk(driverScore.toId)
            .then(driver => {
                var newTotalScore = driver.totalScore + driverScore.value;
                var newScoreQuantity = driver.scoreQuantity + 1;
                driver.update({
                    totalScore: newTotalScore,
                    scoreQuantity: newScoreQuantity
                })
                res.status(201).send(driverScore);
            })
            .catch(error => res.status(400).send(error));
            //res.status(201).send(driverScore)
        })
        .catch(error => res.status(400).send(error));
    },

    list(req, res) {
        return DriverScore
        .findAll()
        .then((driverScores) => res.status(200).send(driverScores))
        .catch(error => res.status(400).send(error));
    },

    retrieve(req, res){},

    update(req, res){},

    destroy(req, res){},

}
