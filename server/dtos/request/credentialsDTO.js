exports.RegisterRequestDTO = class RegisterRequestDTO {
    constructor(arg) {
        if (arg instanceof Map) {
            if (arg.has('facebookId')) {
                this.facebookId = arg.get('facebookId');
            }
            if (arg.has('role')) {
                this.role = arg.get('role');
            }
            if (arg.has('name')) {
                this.name = arg.get('name');
            }
            if (arg.has('phone')) {
                this.phone = arg.get('phone');
            }
            if (arg.has('dni')) {
                this.dni = arg.get('dni');
            }
            if (arg.has('licenseNumber')) {
                this.licenseNumber = arg.get('licenseNumber');
            }
        } else {
            this.facebookId = arg.facebookId;
            this.role = arg.role;
            this.name = arg.name;
            this.phone = arg.phone;
            this.dni = arg.dni;
            this.licenseNumber = arg.licenseNumber;
        }
    }
}