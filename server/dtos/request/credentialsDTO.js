exports.RegisterRequestDTO = class RegisterRequestDTO {
    constructor(arg) {
        if (arg instanceof Map) {
            if (arg.has('id')) {
                this.id = arg.get('id');
            }
            if (arg.has('rol')) {
                this.rol = arg.get('rol');
            }
            if (arg.has('name')) {
                this.firstName = arg.get('firstName');
            }
            if (arg.has('phone')) {
                this.phone = arg.get('phone');
            }
            if (arg.has('dni')) {
                this.dni = arg.get('dni');
            }
        } else {
            this.id = arg.id;
            this.rol = arg.rol;
            this.firstName = arg.firstName;
            this.phone = arg.phone;
            this.dni = arg.dni;
        }
    }
}