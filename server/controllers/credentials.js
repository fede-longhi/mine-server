const Driver = require('../models').Driver;
const Party = require('../models').Party;
const FileDocument = require('../models').FileDocument;
const User = require('../models').User;
const Vehicle = require('../models').Vehicle;
const credentialsDTO = require('../dtos/request/credentialsDTO');
const sequelize = require('../models/index').sequelize;

const statusAvailable = "disponible";
const statusDisconnected = "desconectado";
const statusDisable = "deshabilitado";


module.exports = {
    login(req, res) {
        console.log(req.body);
        try {
            if (req.body.role === 'driver') {
                return Driver.findByPk(req.body.facebookId)
                    .then(driver => {
                        if (!driver) {
                            return res.status(203).send({ status: 203, message: "driver not exists" });
                        }
                        //var isLogged = driver.status != 'offline';
                        if (driver.status != statusDisable)
                            driver.update({
                                status: statusAvailable
                            });
                        res.status(200).send(JSON.stringify({ status: 200, message: "login successfuly"/*, logged: isLogged*/ }));
                    })
                    .catch(error => {
                        console.error(error);
                        res.status(500).send(error);
                    })
            } else if (req.body.role === 'user') {
                return User.findByPk(req.body.facebookId)
                    .then(user => {
                        console.log("user: " + user)
                        if (!user) {
                            return res.status(203).send({ status: 203, message: "user not exists" });
                        }
                        user.update({
                            status: statusAvailable
                        });
                        //var isLogged = user.status != 'offline';
                        res.status(200).send(JSON.stringify({ status: 200, message: "login successfuly"/*, logged: isLogged*/ }));
                    })
                    .catch(error => {
                        console.error(error);
                        res.status(500).send(error);
                    });
            } else {
                return res.status(412).send({ status: 412, message: "Precondition failed" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).send(error);
        }
    },
    logout(req,res){
        console.log(req.body);
        try {
            if (req.body.role === 'driver') {
                return Driver.findByPk(req.body.facebookId)
                    .then(driver => {
                        if (!driver) {
                            return res.status(203).send({ status: 203, message: "driver not exists" });
                        }
                        var isLogged = driver.status != 'offline';
                        //if (driver.status != statusDisable)
                            driver.update({
                                status: statusDisconnected
                            });
                        res.status(200).send(JSON.stringify({ status: 200, message: "logout successfuly"/*, logged: isLogged*/ }));
                    })
                    .catch(error => {
                        console.error(error);
                        res.status(500).send(error);
                    })
            } else if (req.body.role === 'user') {
                return User.findByPk(req.body.facebookId)
                    .then(user => {
                        console.log("user: " + user)
                        if (!user) {
                            return res.status(203).send({ status: 203, message: "user not exists" });
                        }
                        //var isLogged = user.status != 'offline';
                        user.update({
                            status: statusDisconnected
                        });
                        res.status(200).send(JSON.stringify({ status: 200, message: "logout successfuly"/*, logged: isLogged*/ }));
                    })
                    .catch(error => {
                        console.error(error);
                        res.status(500).send(error);
                    });
            } else {
                return res.status(412).send({ status: 412, message: "Precondition failed" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).send(error);
        }
    },

    register(req, res) {
        console.log("register. facebooId: " + req.body.facebookId + ". Name: " + req.body.name);
        try {
            var registerRequestDTO = new credentialsDTO.RegisterRequestDTO(req.body);
            if (registerRequestDTO.role == 'user') {
                User.findByPk(registerRequestDTO.facebookId)
                    .then(user => {
                        if (user != null) {
                            return res.status(203).send({ status: 203, message: "User already exists" });
                        } else {
                            sequelize.transaction(t => {
                                    Party.create({
                                            name: registerRequestDTO.name,
                                            phone: registerRequestDTO.phone,
                                            dni: registerRequestDTO.dni,
                                        })
                                        .then(party => {
                                            User.create({
                                                    id: registerRequestDTO.facebookId,
                                                    status: statusDisable,
                                                    totalScore: 0,
                                                    scoreQuantity: 0,
                                                    partyId: party.id
                                                })
                                                .then(user => {
                                                    registerRequestDTO.files.forEach(fileDocument => {
                                                        fileDocument.partyId = user.partyId;
                                                        FileDocument.create({
                                                                name: fileDocument.name,
                                                                extension: fileDocument.extension || "null",
                                                                partyId: user.partyId,
                                                                data: fileDocument.data})
                                                            .then(console.log("Create File Documente"))
                                                            .catch(error => res.status(400).send(error));
                                                    })
                                                    res.status(200).send(JSON.stringify({ status: 200, message: "User register successfuly" }));
                                                })
                                                .catch(err => {
                                                    console.error(err);
                                                    res.status(500).send(JSON.stringify({ status: 500, message: "unexpected error" }));
                                                });
                                        })
                                        .catch(error => res.status(400).send(error));
                                })
                                .catch(err => {
                                    console.error(err);
                                    res.status(500).send(JSON.stringify({ status: 500, message: "unexpected error" }));
                                });
                        }
                    })
            } else if (registerRequestDTO.role == 'driver') {
                Driver.findByPk(registerRequestDTO.facebookId)
                    .then(driver => {
                        if (driver != null) {
                            return res.status(203).send({ status: 203, message: "Driver already exists" });
                        } else {
                            sequelize.transaction(t => {
                                    Party.create({
                                            name: registerRequestDTO.name,
                                            phone: registerRequestDTO.phone,
                                            dni: registerRequestDTO.dni,
                                        })
                                        .then(party => {
                                            Vehicle.create({
                                                brand : registerRequestDTO.carBrand,
                                                model : registerRequestDTO.carModel,
                                                licensePlate : registerRequestDTO.carPlate,
                                                color : registerRequestDTO.carColor,
                                            })
                                            .then(vehicle => {
                                                Driver.create({
                                                    id: registerRequestDTO.facebookId,
                                                    status: statusDisable,
                                                    licenseNumber: registerRequestDTO.licenseNumber,
                                                    totalScore: 0,
                                                    scoreQuantity: 0,
                                                    partyId: party.id,
                                                    vehicleId: vehicle.id
                                                })
                                                .then(driver => {
                                                    registerRequestDTO.files.forEach(fileDocument => {
                                                        FileDocument.create({
                                                                name: fileDocument.name,
                                                                extension: fileDocument.extension,
                                                                partyId: driver.partyId,
                                                                data: fileDocument.data})
                                                            .then(console.log("Create File Documente"))
                                                            .catch(error => res.status(400).send(error));
                                                    })
                                                    res.status(200).send(JSON.stringify({ status: 200, message: "Driver register successfuly" }));
                                                })
                                                .catch(err => {
                                                    console.error(err);
                                                    res.status(500).send(JSON.stringify({ status: 500, message: "unexpected error" }));
                                                });
                                            })
                                            .catch(err => {
                                                console.error(err);
                                                res.status(500).send(JSON.stringify({ status: 500, message: "unexpected error" }));
                                            });
                                        })
                                        .catch(error => res.status(400).send(error));
                                })
                                .catch(err => {
                                    console.error(err);
                                    res.status(500).send(JSON.stringify({ status: 500, message: "unexpected error" }));
                                });
                        }
                    })
            } else {
                return res.status(412).send({ status: 412, message: "Precondition failed" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).send(error);
        }
    }
};