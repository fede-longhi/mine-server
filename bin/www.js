// This will be our application entry. We'll setup our server here.
const http = require('http');
const app = require('../app'); // The express app we just created

const port = parseInt(process.env.PORT, 10) || 8081;
app.set('port', port);

const server = http.createServer(app);
server.listen(port);

var connectionModel = require("../server/util/connection")
var global = require("../server/util/util");
io = require('socket.io').listen(server);
io.set('transports', ['websocket']);

var connectionUsers = new Map();
var connectionDrivers = new Map();
var connectionDelete = new Map();
var positionDrivers = new Map();

io.on('connection', (socket) => {
    socket.on('ROL', function(rol, id) {
        if (rol == "USER") {
            var userID = id;
            console.info("User id " + userID + ", is connected " + socket.id);
            var connection = new connectionModel.ConnectionInfo(userID, rol, socket);
            connectionUsers.set(userID, connection);
            exports.connectionUsers = connectionUsers;
        } else {
            var driverID = id;
            console.info("Driver id " + driverID + ", is connected " + socket.id);
            var connection = new connectionModel.ConnectionInfo(driverID, rol, socket);
            connectionDrivers.set(driverID, connection);
            exports.connectionDrivers = connectionDrivers;

            //adding driver to save his position for algorithm find driver for travel
            exports.positionDrivers = positionDrivers.set(driverID, null);
        }
        socket.emit("ROL_RESPONSE", connection.id);
    });

    socket.on('FIN ROL', function(rol, id) {
        if (rol == "USER") {
            var aConnection = connectionUsers.get(id);
            if (aConnection != null && aConnection != undefined) {
                console.info("User id " + id + " has left : " + aConnection.socket.id);
                connectionDelete.set(id, aConnection);
            }
            connectionUsers.delete(id);
        } else {
            var aConnection = connectionDrivers.get(id);
            if (aConnection != null && aConnection != undefined) {
                console.info("Driver id " + id + " has left : " + aConnection.socket.id);
                connectionDelete.set(id, aConnection);
            }
            connectionDrivers.delete(id);
        }
    });

    socket.on('disconnect', () => {
        if (connectionUsers.has(socket.id)) {
            var aConnection = connectionUsers.get(socket.id);
            console.info("User id " + aConnection.id + " has left : " + socket.id);
            connectionDelete.set(socket.id, aConnection);
            connectionUsers.delete(socket.id);
        }
        if (connectionDrivers.has(socket.id)) {
            var aConnection = connectionDrivers.get(socket.id);
            console.info("Driver id " + aConnection.id + " has left : " + socket.id);
            connectionDrivers.delete(socket.id);
        }
        socket.disconnect(true);
    });

    socket.emit("message", {
        id: 1,
        text: "i'm a message",
        author: "app-server"
    });

});