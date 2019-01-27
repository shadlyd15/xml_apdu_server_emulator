
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
        // console.log('Data received from client: ' + chunk.toString());
        var str = chunk.toString();
        tagged_addrress = str.match(/<h:addr\b[^>]*>(.*?)<\/h:addr>/gm);
        if(tagged_addrress){
        	var data = str.match(/<h:d\b[^>]*>(.*?)<\/h:d>/gm);
        	if(data == "<h:d>3</h:d>"){
        		console.log("Ping : " + tagged_addrress);
        		socket.write("<? xml version=\'1.0\' ?><h:rt xmlns h=\'ProtocolHead\'><h:pv>1</h:pv>" + tagged_addrress + "<h:dir>down</h:dir><h:pt>1</h:pt><h:fc>1</h:fc><h:seq>1</h:seq><h:e>00</h:e><h:a>0</h:a><h:d>3</h:d><h:sg></h:sg></h:rt>", socket);
        		// setTimeout(function(sock){
				// 	if(sock){
				// 		console.log("Sending Ping Response");
				// 		sock.write("<? xml version=\'1.0\' ?><h:rt xmlns h=\'ProtocolHead\'><h:pv>1</h:pv>" + tagged_addrress + "<h:dir>down</h:dir><h:pt>1</h:pt><h:fc>1</h:fc><h:seq>1</h:seq><h:e>00</h:e><h:a>0</h:a><h:r>000000000000000000000000</h:r><h:d>3</h:d><h:sg></h:sg></h:rt>");
				// 	} else{
				// 		console.log("No Valid Socket");
				// 	}
				// }, 0);
	        } else if(data == "<h:d>1</h:d>"){
	        	console.log("Login Request : " + tagged_addrress);
	            socket.write("<? xml version=\'1.0\' ?><h:rt xmlns h=\'ProtocolHead\'><h:pv>1</h:pv>" + tagged_addrress + "<h:dir>down</h:dir><h:pt>1</h:pt><h:fc>2</h:fc><h:seq>1</h:seq><h:e>00</h:e><h:a>0</h:a><h:r></h:r><h:d>1</h:d><h:sg></h:sg></h:rt>");
	        } else{
	        	console.log("Received Data : " + data);
	        }
        } else{
        	console.log("Invalid Incoming Data");
        }
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

// setInterval(function(socket){
// 	if(sock){
// 		console.log("Sending Balance Request");
// 		sock.write("<? xml version='1.0' ?><h:rt xmlns h='ProtocolHead'><h:pv>1</h:pv>" + tagged_addrress + "<h:dir>down</h:dir><h:pt>1</h:pt><h:fc>3</h:fc><h:seq>4</h:seq><h:e>00</h:e><h:a>1</h:a><h:r>485845110000000000000004</h:r><h:d>000100010001000DC00104000301008C8100FF0200</h:d><h:sg>E54B44C5144A5EB59D430B40AF9E2741F258D125AB291627330A23E2C12B2366</h:sg></h:rt>");
// 	}
// }, 1000);
