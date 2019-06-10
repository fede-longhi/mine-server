const Driver = require('../models').Driver;
const Vehicle = require('../models').Vehicle;
const Party = require('../models').Party;
const Travel = require('../models').Travel;
const User = require('../models').User;
const Address = require('../models').Address;
const UserScore = require('../models').UserScore;
const DriverScore = require('../models').DriverScore;
const Op = require('../models/index').Sequelize.Op;

module.exports = {
    create(req, res) {
        return Driver
            .create({
                id: driverId,
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
                include: [
                    {
                        model: Party,
                        as: 'party'
                    },
                    {
                        model: Address,
                        as: 'location'
                    }
                ]
            })
            .then((drivers) => res.status(200).send(drivers))
            .catch((error) => res.status(400).send(error));
    },

    getDriverById(req, res){
        return Driver
            .findByPk(req.query.driverId, {
                include: [
                    {
                        model: Party,
                        as: 'party',
                    },
                    {
                        model: Vehicle,
                        as: 'vehicle',
                    },
                    {
                        model: Address,
                        as: 'location'
                    }
                ]
            })
            .then(driver => {
                if (!driver) {
                    return res.status(404).send({
                        message: 'Driver Not Found',
                    });
                }
                return res.status(200).send(driver);
            })
            .catch(error => res.status(400).send(error));
    },


    retrieve(req, res) {
        console.log('Request find by query params: ' + JSON.stringify(req.query));
        if (Object.keys(req.query).length > 0) {
            var hasDriverId = (!!req.query.driverId);
            var hasName = (!!req.query.name);
            var hasStatus = (!!req.query.status);
            var hasMinScore = (!!req.query.minScore);
            var hasMaxScore = (!!req.query.maxScore);
            var hasPlate = (!!req.query.plate)
            if (hasDriverId) {
                console.log('Find By PK: ' + req.query.driverId);
                return Driver
                    .findByPk(req.query.driverId, {include: [
                        {
                            model: Party,
                            as: 'party',
                        },
                        {
                            model: Vehicle,
                            as: 'vehicle',
                        },
                        {
                            model: Address,
                            as: 'location'
                        }
                    ]})
                    .then(driver => {
                        if (!driver) {
                            return res.status(404).send({
                                message: 'Driver Not Found',
                            });
                        }
                        return res.status(200).send(driver);
                    })
                    .catch(error => res.status(400).send(error));
            } else if (hasName && hasStatus && hasMinScore && hasMaxScore && hasPlate) {
                return Driver
                    .findAll({
                        include: [{
                            model: Party,
                            as: 'party',
                            where: {
                                name: req.query.name
                            }
                        },
                        {
                            model: Vehicle,
                            as: 'vehicle',
                            where: {
                                licensePlate: req.query.plate
                            }
                        }],
                        where: {
                            status: req.query.status,
                            totalScore: {[Op.between] : [req.query.minScore,req.query.maxScore]}
                        }
                    })
                    .then((drivers) => res.status(200).send(drivers))
                    .catch((error) => res.status(400).send(error.message));
            } else if (hasMinScore && hasMaxScore) {
                return Driver
                    .findAll({
                        include: [{
                            model: Party,
                            as: 'party',
                        },
                        {
                            model: Vehicle,
                            as: 'vehicle',
                        }],
                        where: {
                            totalScore: {[Op.between] : [req.query.minScore,req.query.maxScore]}
                        }
                    })
                    .then((drivers) => res.status(200).send(drivers))
                    .catch((error) => res.status(400).send(error.message));
            } else if (hasMinScore) {
                return Driver
                    .findAll({
                        include: [{
                            model: Party,
                            as: 'party',
                        },
                        {
                            model: Vehicle,
                            as: 'vehicle',
                        }],
                        where: {
                            totalScore: {[Op.gte] : [req.query.minScore]}
                        }
                    })
                    .then((drivers) => res.status(200).send(drivers))
                    .catch((error) => res.status(400).send(error.message));
            } else if (hasMaxScore) {
                return Driver
                    .findAll({
                        include: [{
                            model: Party,
                            as: 'party',
                        },
                        {
                            model: Vehicle,
                            as: 'vehicle',
                        }],
                        where: {
                            totalScore: {[Op.lte] : [req.query.maxScore]}
                        }
                    })
                    .then((drivers) => res.status(200).send(drivers))
                    .catch((error) => res.status(400).send(error.message));
            } else if (hasStatus) {
                return Driver
                    .findAll({
                        include: [{
                            model: Party,
                            as: 'party',
                        },
                        {
                            model: Vehicle,
                            as: 'vehicle',
                        }],
                        where: {
                            status: req.query.status
                        }
                    })
                    .then((drivers) => res.status(200).send(drivers))
                    .catch((error) => res.status(400).send(error.message));
            } else if (hasName) {
                return Driver
                    .findAll({
                        include: [{
                            model: Party,
                            as: 'party',
                            where: {
                                name: req.query.name
                            }
                            },
                            {
                                model: Vehicle,
                                as: 'vehicle',
                            }]})
                    .then((drivers) => res.status(200).send(drivers))
                    .catch((error) => res.status(400).send(error.message));
            } else if (hasPlate) {
                return Driver
                    .findAll({
                        include: [{
                            model: Party,
                            as: 'party',
                        },
                        {
                            model: Vehicle,
                            as: 'vehicle',
                            where: {
                                licensePlate: req.query.plate
                            }
                        }]
                    })
                    .then((drivers) => res.status(200).send(drivers))
                    .catch((error) => res.status(400).send(error.message));
            } else {
                res.status(412).send("Precondition Failed");
            }
        } else {
            console.log('Find all');
            return Driver
                .findAll({
                    include: [{
                        model: Party,
                        as: 'party',
                    },
                    {
                        model: Vehicle,
                        as: 'vehicle',
                    }]
                })
                .then((drivers) => res.status(200).send(drivers))
                .catch((error) => res.status(400).send(error.message));
        }
    },

    update(req, res) {
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


    destroy(req, res) {
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

    getTravels(req, res) {
        return Travel
        .findAll({
            where: {
                driverId: req.params.driverId,
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
        return DriverScore
        .findAll({
            where: {
                toId: req.params.driverId,
            }
        })
        .then((driverScore) => res.status(200).send(driverScore))
        .catch(error => res.status(400).send(error));
    },

    getScoresGiven(req, res) {
        return UserScore
        .findAll({
            where: {
                fromId: req.params.driverId,
            }
        })
        .then((userScore) => res.status(200).send(userScore))
        .catch(error => res.status(400).send(error));
    },

    updatePosition(req, res){
        return Driver
        .findByPk(req.params.driverId)
        .then( driver => {
            Address.create({
                latitude: req.body.latitude,
                longitude: req.body.longitude
            })
            .then( address => {
                driver.locationId = address.id;
                driver.save()
                .then( () => {
                    res.status(200).send();
                })
                .catch(error => res.status(400).send(error));
            })
            .catch(error => res.status(400).send(error));
        })
        .catch(error => res.status(400).send(error));
    }

}