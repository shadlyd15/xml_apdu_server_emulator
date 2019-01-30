
const Net = require('net');
const port = 3232;

var sock = null;
const server = new Net.Server();
server.listen(port, function() {
    console.log('Server listening for connection requests on socket localhost: ' + port);
});

server.on('connection', function(socket) {
    sock = socket;
    console.log('A new connection has been established');
    socket.on('data', function(chunk) {
        var str = chunk.toString();
        var tagged_addrress = str.match(/<h:addr\b[^>]*>(.*?)<\/h:addr>/gm);
        if(tagged_addrress){
        	var data = str.match(/<h:d\b[^>]*>(.*?)<\/h:d>/gm);
        	if(data == "<h:d>3</h:d>"){
        		console.log("Ping : " + tagged_addrress);
        		socket.write("<? xml version=\'1.0\' ?><h:rt xmlns h=\'ProtocolHead\'><h:pv>1</h:pv>" + tagged_addrress + "<h:dir>down</h:dir><h:pt>1</h:pt><h:fc>1</h:fc><h:seq>1</h:seq><h:e>00</h:e><h:a>0</h:a><h:d>3</h:d><h:sg></h:sg></h:rt>");
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
    });

    socket.on('error', function(err) {
        console.log(`Error: ${err}`);
    });
});

// setInterval(function(){
//     if(sock){
//         console.log("Sending Shit");
//         sock.write("<h:rt>BITCH</h:rt>");
//     } else{
//         console.log("NULL Sock");
//     }
// }, 3000);