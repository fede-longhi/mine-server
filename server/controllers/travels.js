const Travel = require('../models').Travel;
var managerTravelRequest = require('./travelRequestManagerService');

/**
 * map when storage response of the drivers
 * contain <idTravel,boolean>
*/
responseOfDriverToTravels = new Map();
exports.responseOfDriverToTravels = responseOfDriverToTravels;

/**
 * contains all sockets of all users and drivers
 */
allSockets = require("../../bin/www");

/**
 * is reemplace for a service that found travels, users, drivers
 * of the DB
 */
//travelService = require("./mock/travelServiceMock"),

var partyDTOModel = require("../dtos/request/partyDTO"),
    travelDTOModel = require('../dtos/request/travelDTO');

module.exports = {
    create(req, res) {
        return Travel
        .create({
            status: req.body.status,
            smallPetQuantity: req.body.smallPetQuantity,
            mediumPetQuantity: req.body.mediumPetQuantity,
            bigPetQuantity: req.body.bigPetQuantity,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            price: req.body.price,
            hasCompanion: req.body.hasCompanion,
            driverId: req.body.driverId,
            userId: req.body.userId
        })
        .then(travel => res.status(201).send(travel))
        .catch(error => res.status(400).send(error.message));
    },

    list(req, res) {
        return Travel
        .findAll()
        .then((travels) => res.status(200).send(travels))
        .catch(error => res.status(400).send(error.message));
    },

    retrieve(req, res){
        return Travel
        .findByPk(req.params.travelId)
        .then(travel => {
            if(!travel){
                return res.status(404).send({
                    message: 'Travel Not Found',
                });
            }
            return res.status(200).send(travel);
        })
        .catch(error => res.status(400).send(error));
    },

    update(req, res){
        return Travel
        .findByPk(req.params.travelId)
        .then(travel => {
            if (!travel) {
                return res.status(404).send({
                    message: 'Travel Not Found',
                });
            }
            return travel
            .update({
                status: req.body.status,
                smallPetQuantity: req.body.smallPetQuantity,
                mediumPetQuantity: req.body.mediumPetQuantity,
                bigPetQuantity: req.body.bigPetQuantity,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                price: req.body.price,
                hasCompanion: req.body.hasCompanion,
                driverId: req.body.driverId,
                userId: req.body.userId
            })
            .then((travel) => res.status(200).send(travel))  // Send back the updated todo.
            .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
    },

    destroy(req, res){
        return Travel
        .findByPk(req.params.travelId)
        .then(travel => {
            if (!travel) {
            return res.status(400).send({
                message: 'Travel Not Found',
            });
            }
            return travel
            .destroy()
            .then(() => res.status(204).send())
            .catch(error => res.status(400).send(error));
        })
        .catch(error => res.status(400).send(error));
    },
    confirmation(req, res){
        console.info("TravelResource :" + JSON.stringify(req.body));
        var aTravelConfirmationRequestDTO = new travelDTOModel.TravelConfirmationRequestDTO(req.body);
        console.log("####message confirmation###: "+JSON.stringify(aTravelConfirmationRequestDTO));
        var connectionUsers = allSockets.connectionUsers;
        var connectionDrivers = allSockets.connectionDrivers;
        var aConnectionDriver = null;
        if (aTravelConfirmationRequestDTO.rol == "USER") {
    
            console.log("----solicitud de viaje----");
            //res.status(200).send({status:200, message: "su chofer está en camino"});
            // launch thread
            /***
             * Este comentario es sólo para mockear
             */
            managerTravelRequest.manageTravelRequest(aTravelConfirmationRequestDTO.travelID)
            .then((value)=>{
                console.log("respuesta de manager: "+value);
                res.status(200).send({status:200, message: "su chofer está en camino"});
            })
            .catch((value)=>{
                console.log("respuesta de manager: "+value);
                res.status(400).send({status:400, message: "No hay choferes en este momento"});
            })
        }
        var aConnectionUser = null;
        if (aTravelConfirmationRequestDTO.rol == "DRIVER") {
            //if travel is rejected
            if(!aTravelConfirmationRequestDTO.accept){
                console.log("------------------ travel is rejected ------------------");
                responseOfDriverToTravels.set(aTravelConfirmationRequestDTO.travelID,false);
                res.status(200).send({status:200, message:"viaje rechazado correctamente"});
            }else{
                //travel is accepted
                responseOfDriverToTravels.set(aTravelConfirmationRequestDTO.travelID,true);
                console.log("------------------ travel is accepted ------------------");
                /**
                 * HARCODEOOOOOO
                 * para probar desde postman
                 */
                //res.status(200).send({status:200, message:"viaje aceptado correctamente"});
    
                //notify to user
                try {
                    if (connectionUsers != undefined) {
                        aConnectionUser = connectionUsers.values().next().value; 
                    }
                } catch (err) {
                    console.error(err);
                    res.status(400).send({status:400, message:"error inesperado"});
                }
                if (aConnectionUser == null || aConnectionUser == undefined) {
                    console.error("There are no Users");
                    res.status(204).send({status:204, message:"There are not Users"});
                } else {
                    console.info("Available User");
                    // logica de mandar el emit al chofer
                    //var aTravel = travelService.findTravelByTravelID(aTravelConfirmationRequestDTO.travelID);
                    try {
                        //var aTravel = travelService.confirmTravel(aTravelConfirmationRequestDTO.travelID);
                        //aTravel.driverID = aTravelConfirmationRequestDTO.id;
                        var aTravelConfirmationResponseDTO = new travelDTOModel.TravelConfirmationResponseDTO();
                        aTravelConfirmationResponseDTO.travelID = /*aTravel.travelID;*/"0";
                        aTravelConfirmationResponseDTO.time = /*Math.round(aTravel.time);*/"123";
                        aTravelConfirmationResponseDTO.driver = /*travelService.findDriver(aTravel.driverID);*/"123";
    
                        console.log("lo que se va mandar al usuario: "+JSON.stringify(aTravelConfirmationResponseDTO));
    
                        aConnectionUser.socket.emit("NOTIFICATION_OF_TRAVEL", aTravelConfirmationResponseDTO);
        
                        console.log("Se mandó al usuario ");
    
                        aTravelConfirmationResponseDTO.driver = null;
                        aTravelConfirmationResponseDTO.user = /*travelService.findUser(aTravel.userID);*/"123";
                        aTravelConfirmationResponseDTO
                        res.status(200).send(aTravelConfirmationResponseDTO);
                    } catch (error) {
                        res.status(500).send(error);
                    }
                }
            }
        }

    },
}
