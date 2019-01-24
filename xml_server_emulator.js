
const Net = require('net');
const port = 1337;

const server = new Net.Server();
server.listen(port, function() {
    console.log('Server listening for connection requests on socket localhost:${port}');
});

server.on('connection', function(socket) {
    console.log('A new connection has been established');

    socket.on('data', function(chunk) {
        console.log('Data received from client: ' + chunk.toString());
        socket.write("<? xml version=\'1.0\' ?><h:rt xmlns h=\'ProtocolHead\'><h:pv>1</h:pv><h:addr>20140000001</h:addr><h:dir>down</h:dir><h:pt>1</h:pt><h:fc>2</h:fc><h:seq>1</h:seq><h:e>00</h:e><h:a>0</h:a><h:r></h:r><h:d>1</h:d><h:sg></h:sg></h:rt>");
    });

    socket.on('end', function() {
        console.log('Closing connection with the client');
    });

    socket.on('error', function(err) {
        console.log(`Error: ${err}`);
    });
});