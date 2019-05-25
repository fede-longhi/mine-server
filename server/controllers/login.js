const Driver = require('../models').Driver;
const Party = require('../models').Party;
const User = require('../models').User;

module.exports = {
    login(req, res) {
        console.log(req.body);
        return Party
        .findByPk(req.body.facebookId)
        .then( party => {
            console.log(party);
            if (req.body.role === 'driver'){
                Driver.findOne({
                    where: {
                        partyId: party.id
                    }
                })
                .then(driver => {
                    if (!driver){
                        return res.status(404).send({
                            message: "User not found."
                        })
                    }
                    var isLogged = driver.status != 'offline'; 
                    return res.status(200).send({
                        logged: isLogged,
                    });
                })
            }else if (req.body.role === 'user'){
                User.findOne({
                    where: {
                        partyId: party.id
                    }
                })
                .then(user => {
                    if (!user){
                        return res.status(404).send({
                            message: "User not found."
                        })
                    }
                    var isLogged = user.status != 'offline'; 
                    return res.status(200).send({
                        logged: isLogged,
                    });
                })
            }
        })
    }
}