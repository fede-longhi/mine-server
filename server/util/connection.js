exports.ConnectionInfo = class ConnectionInfo {
    constructor(id, rol, socket) {
        this.id = id;
        this.rol = rol;
        this.socket = socket;
    }
}