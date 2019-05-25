const Driver = require('../models').Driver;
const Party = require('../models').Party;
const User = require('../models').User;
const credentialsDTO = require('../dtos/request/credentialsDTO');

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
                        var isLogged = driver.status != 'offline';
                        res.status(200).send(JSON.stringify({ status: 200, message: "login successfuly", logged: isLogged }));
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
                        var isLogged = user.status != 'offline';
                        res.status(200).send(JSON.stringify({ status: 200, message: "login successfuly", logged: isLogged }));
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
        console.log(req.body);
        try {
            var registerRequestDTO = new credentialsDTO.RegisterRequestDTO(req.body);
            if (registerRequestDTO.role == 'user') {
                User.findByPK(partyCredentialsRequestDTO.id)
                    .then(user => {
                        if (user != null) {
                            res.status(203).send({ status: 203, message: "User already exists" });
                        } else {
                            User.create(registerRequestDTO)
                                .then(user => {
                                    res.status(200).send(JSON.stringify({ status: 200, message: "User register successfuly" }));
                                })
                                .catch(err => {
                                    console.error(err);
                                    res.status(500).send(JSON.stringify({ status: 500, message: "unexpected error" }));
                                });
                        }
                    })
                    .catch(err => {
                        console.error(err);
                        res.status(500).send(JSON.stringify({ status: 500, message: "unexpected error" }));
                    });


            } else if (registerRequestDTO.role == 'driver') {
                Driver.findByPK(partyCredentialsRequestDTO.id)
                    .then(driver => {
                        if (driver != null) {
                            res.status(203).send({ status: 203, message: "driver already exists" });
                        } else {
                            driver.create(registerRequestDTO)
                                .then(driver => {
                                    res.status(200).send(JSON.stringify({ status: 200, message: "driver register successfuly" }));
                                })
                                .catch(err => {
                                    console.error(err);
                                    res.status(500).send(JSON.stringify({ status: 500, message: "unexpected error" }));
                                });
                        }
                    })
                    .catch(err => {
                        console.error(err);
                        res.status(500).send(JSON.stringify({ status: 500, message: "unexpected error" }));
                    });
            }
        } catch (error) {
            console.error(error);
            res.status(500).send(error);
        }
    }
};