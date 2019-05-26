var partyDTOModel = require('./partyDTO');

exports.TravelCotizationDTO = class TravelCotizationDTO {
    constructor() {
        this.travelID;
        this.price;
    }
};

exports.TravelNotificationDTO = class TravelNotificationDTO {
    constructor() {
        this.travelID;
        this.from;
        this.to;
        this.petAmountSmall;
        this.petAmountMedium;
        this.petAmountLarge;
        this.hasACompanion;
    }
};

exports.TravelConfirmationRequestDTO = class TravelConfirmationRequestDTO {
    constructor(arg) {
        if (arg instanceof Map) {
            if (arg.has('travelID')) {
                this.travelID = arg.get('travelID');
            }
            if (arg.has('rol')) {
                this.rol = arg.get('rol');
            }
            if (arg.has('id')) {
                this.id = arg.get('id');
            }
            if (arg.has('accept')) {
                this.id = arg.get('accept');
            }
        } else {
            this.travelID = arg.travelID;
            this.rol = arg.rol;
            this.id = arg.id;
            this.accept = arg.accept;
        }
    }
};

exports.TravelConfirmationResponseDTO = class TravelConfirmationResponseDTO {
    constructor() {
        this.travelID;
        this.user = new partyDTOModel.UserDTO();
        this.driver = new partyDTOModel.DriverDTO();
        this.time;
    }
};

exports.TravelFinalizeRequestDTO = class TravelFinalizeRequestDTO {
    constructor(arg) {
        if (arg instanceof Map) {
            if (arg.has('travelId')) {
                this.travelId = arg.get('travelId');
            }
            if (arg.has('id')) {
                this.id = arg.get('id');
            }
        } else {
            this.travelId = arg.travelId;
            this.id = arg.id;
        }
    }
};

exports.TravelCancelRequestDTO = class TravelCancelRequestDTO {
    constructor(arg) {
        if (arg instanceof Map) {
            if (arg.has('travelId')) {
                this.travelId = arg.get('travelId');
            }
            if (arg.has('role')) {
                this.role = arg.get('role');
            }
            if (arg.has('id')) {
                this.id = arg.get('id');
            }
        } else {
            this.travelId = arg.travelId;
            this.role = arg.role;
            this.id = arg.id;
        }
    }
};