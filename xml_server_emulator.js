
const Net = require('net');
const port = 1337;
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const server = new Net.Server();
server.listen(port, function() {
    console.log('Server listening for connection requests on socket localhost:${port}');
});

var sock;
var tagged_addrress;

server.on('connection', function(socket) {
	sock = socket;
    console.log('A new connection has been established');

    socket.on('data', function(chunk) {
        // console.log('Data received from client: ' + chunk.toString());
        var str = chunk.toString();
        var addr = str.match(/<h:addr\b[^>]*>(.*?)<\/h:addr>/gm);
        if(addr){
        	tagged_addrress = addr;
        	var data = str.match(/<h:d\b[^>]*>(.*?)<\/h:d>/gm);
        	if(data == "<h:d>3</h:d>"){
        		console.log("Ping : " + addr);
        		socket.write("<? xml version=\'1.0\' ?><h:rt xmlns h=\'ProtocolHead\'><h:pv>1</h:pv>" + addr + "<h:dir>down</h:dir><h:pt>1</h:pt><h:fc>1</h:fc><h:seq>1</h:seq><h:e>00</h:e><h:a>0</h:a><h:r>000000000000000000000000</h:r><h:d>3</h:d><h:sg></h:sg></h:rt>");
	        } else if(data == "<h:d>1</h:d>"){
	        	console.log("Login Request : " + addr);
	            socket.write("<? xml version=\'1.0\' ?><h:rt xmlns h=\'ProtocolHead\'><h:pv>1</h:pv>" + addr + "<h:dir>down</h:dir><h:pt>1</h:pt><h:fc>2</h:fc><h:seq>1</h:seq><h:e>00</h:e><h:a>0</h:a><h:r></h:r><h:d>1</h:d><h:sg></h:sg></h:rt>");
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


setInterval(function(socket){
	if(sock){
		console.log("Sending Balance Request");
		sock.write("<? xml version='1.0' ?><h:rt xmlns h='ProtocolHead'><h:pv>1</h:pv>" + tagged_addrress + "<h:dir>down</h:dir><h:pt>1</h:pt><h:fc>3</h:fc><h:seq>4</h:seq><h:e>00</h:e><h:a>1</h:a><h:r>485845110000000000000004</h:r><h:d>000100010001000DC00104000301008C8100FF0200</h:d><h:sg>E54B44C5144A5EB59D430B40AF9E2741F258D125AB291627330A23E2C12B2366</h:sg></h:rt>");
	}
}, 1000);

// rl.question('What do you think of Node.js? ', (answer) => {
//   // TODO: Log the answer in a database
//   console.log(`Thank you for your valuable feedback: ${answer}`);

//   rl.close();
// });