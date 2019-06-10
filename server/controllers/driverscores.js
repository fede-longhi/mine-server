const DriverScore = require('../models').DriverScore;
const Driver = require('../models').Driver;

module.exports = {
    create(req, res) {
        console.log('Request create driver score: ' + JSON.stringify(req.body));
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
        console.log('Find all');
        return DriverScore
        .findAll()
        .then((driverScores) => res.status(200).send(driverScores))
        .catch(error => res.status(400).send(error));
    },

    retrieve(req, res){
        console.log('Request find by query params: ' + JSON.stringify(req.query));
        if (Object.keys(req.query).length > 0) {
            var hasDriverScoreId = (!!req.query.driverScoreId);
            var hasFromId = (!!req.query.fromId);
            var hasToId = (!!req.query.toId);
            if (hasDriverScoreId) {
                console.log('Find by pk: '  + req.query.driverScoreId);
                return DriverScore
                    .findByPk(req.query.driverScoreId)
                    .then((driverScores) => res.status(200).send(driverScores))
                    .catch(error => res.status(400).send(error));
            } else if (hasFromId) {
                return DriverScore
                    .findAll( 
                        {where: {
                        fromId: req.query.fromId}})
                    .then((driverScores) => {
                        if (!!driverScores) {
                            return res.status(200).send(driverScores);  
                        }
                        return res.status(400).send({message: "DriverScores not found."})
                    }) 
                    .catch(error => res.status(400).send(error));    
            } else if (hasToId) {
                return DriverScore
                    .findAll( 
                        {where: {
                        toId: req.query.toId}})
                    .then((driverScores) => {
                        if (!!driverScores) {
                            return res.status(200).send(driverScores);  
                        }
                        return res.status(400).send({message: "DriverScores not found."})
                    }) 
                    .catch(error => res.status(400).send(error));    
            } else {
                res.status(412).send("Precondition Failed");
            }
        } else {
            console.log('Find all');
            return DriverScore
                .findAll()
                .then((driverScores) => res.status(200).send(driverScores))
                .catch(error => res.status(400).send(error));
        }

    },

    update(req, res){},

    destroy(req, res){},

}
