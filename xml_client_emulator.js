
var net = require('net');

var client = new net.Socket();
client.connect(1337, '127.0.0.1', function() {
	console.log('Connected');
	client.write('<? xml version=\'1.0\' ?><h:rt xmlns h=\'ProtocolHead\'><h:pv>1</h:pv><h:addr>20140000001</h:addr><h:dir>up</h:dir><h:pt>1</h:pt><h:fc>1</h:fc><h:seq>1</h:seq><h:e>00</h:e><h:a>0</h:a><h:r>000000000000000000000000</h:r><h:d>1</h:d><h:sg></h:sg></h:rt>');
});

client.on('data', function(data) {
	// console.log('Received: ' + data);
	// client.destroy(); // kill client after server's response

    var str = data.toString();
    var addr = str.match(/<h:addr\b[^>]*>(.*?)<\/h:addr>/gm);
    if(addr){
    	tagged_addrress = addr;
    	var data = str.match(/<h:d\b[^>]*>(.*?)<\/h:d>/gm);
    	if(data == "<h:d>3</h:d>"){
    		console.log("Ping Response");
        } else{
        	console.log("Received Data : " + data);
        }
    } else{
    	console.log("Invalid Incoming Data");
    }
});

client.on('close', function() {
	console.log('Connection closed');
});

setInterval(function(){
	console.log("Sending Ping");
		client.write('<? xml version=\'1.0\' ?><h:rt xmlns h=\'ProtocolHead\'><h:pv>1</h:pv><h:addr>20140000001</h:addr><h:dir>up</h:dir><h:pt>1</h:pt><h:fc>1</h:fc><h:seq>1</h:seq><h:e>00</h:e><h:a>0</h:a><h:r>000000000000000000000000</h:r><h:d>3</h:d><h:sg></h:sg></h:rt>');
}, 1000);