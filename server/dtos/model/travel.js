var baseModel = require('./base') 

var statesDB = null;

module.exports = {
    GeographicCoordenate : class GeographicCoordenate {
        constructor(arg) {
            if (arg instanceof Map) {
                if (arg.has('latitude')) {
                    this.latitude = arg.get('latitude');
                }
                if (arg.has('longitude')) {
                    this.longitude = arg.get('longitude');
                }
            } else {
                this.latitude = arg.latitude;
                this.longitude = arg.longitude;
            }
        }
    },
    
    State : class State extends baseModel.Base {
        constructor(id, description) {
            super(id, description);
        }
    },
    
    Travel : class Travel {
        constructor(id, from, to) {
            this.travelID = id;
            this.from = from;
            this.to = to;
            this.driverID;
            this.userID;
            this.petAmountSmall;
            this.petAmountMedium;
            this.petAmountLarge;
            this.hasACompanion;
            this.distance;
            this.time;
            this.price;
            this.states = [];
        }
    },
    
    getAllStates : function getAllStates() {
        console.info("Travel :" + " getAllStates");
        if (statesDB == null) {
            statesDB = new Map();
            var cotizated = new this.State(1, "cotizated");
            var userConfirmated = new this.State(2, "user confirmated");
            var driverConfirmated = new this.State(3, "driver confirmated");
            var finalized = new this.State(4, "finalized");
            statesDB.set(1, cotizated);
            statesDB.set(2, userConfirmated);
            statesDB.set(3, driverConfirmated);
            statesDB.set(4, finalized);
        }
        return statesDB;
    }
}
