
const Net = require('net');
const port = 3232;

const server = new Net.Server();
server.listen(port, function() {
    console.log('Server listening for connection requests on socket localhost: ' + port);
});

var sock;
var clients = [];
var tagged_addrress;

server.on('connection', function(socket) {
	sock = socket;
    console.log('A new connection has been established');
    // socket.write("<? xml version=\'1.0\' ?><h:rt xmlns h=\'ProtocolHead\'><h:pv>1</h:pv>");
    // socket.write("" + tagged_addrress);
    // socket.write("<h:dir>down</h:dir><h:pt>1</h:pt><h:fc>1</h:fc><h:seq>1</h:seq><h:e>00</h:e><h:a>0</h:a><h:r>000000000000000000000000</h:r><h:d>3</h:d><h:sg></h:sg></h:rt>");
    clients.push(socket);
    socket.on('data', function(chunk) {
    	console.log(chunk.toString());
    	socket.write(chunk.toString());
    });

    socket.on('end', function() {
        console.log('Closing connection with the client');
        sock = 0;
        tagged_addrress = 0;
    });

    socket.on('error', function(err) {
        console.log(`Error: ${err}`);
    });
});

// Send a message to all clients
function broadcast(message, sender) {
	clients.forEach(function (client) {
		// Don't want to send it to sender
		if (client === sender) return;
		client.write(message);
	});
}
