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