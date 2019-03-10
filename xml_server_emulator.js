
const gcm = require('node-aes-gcm');
const Net = require('net');
const port = 3232;

var key = new Buffer([ 0xfe, 0xff, 0xe9, 0x92, 0x86, 0x65, 0x73, 0x1c, 0x6d, 0x6a, 0x8f, 0x94, 0x67, 0x30, 0x83, 0x08 ]);
var iv =  new Buffer([ 0xca, 0xfe, 0xba, 0xbe, 0xfa, 0xce, 0xdb, 0xad, 0xde, 0xca, 0xf8, 0x88 ]);

// plaintext = new Buffer([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]);
// e = gcm.encrypt(key, iv, plaintext, new Buffer([]));

function toHexString(byteArray) {
  return Array.from(byteArray, function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('')
}

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
	        	console.log("Received Data : " + data + + "\r\n");
	        }
        } else{
        	console.log("Invalid Incoming Data");
        }
    });

    socket.on('end', function() {
        console.log('Closing connection with the client');
        sock = null;
    });

    socket.on('error', function(err) {
        console.log(`Error: ${err}`);
    });
});

// 000100010001000DC00104000301008C8100FF0200

const enable_encryption = true;
setInterval(function(){
    if(sock){
        if(enable_encryption){
            plaintext = new Buffer("000100010001000DC001C100080000010000FF0200");
            e = gcm.encrypt(key, iv, plaintext, new Buffer([]));
            sock.write("<h:rt><h:d>" + toHexString(e.ciphertext) + "</h:d></h:rt>");
            console.log("Sending Encrypted APDU : " + toHexString(e.ciphertext) + "\r\n");
        } else{
            plaintext = new Buffer("000100010001000DC001C100080000010000FF0200");
            // e = gcm.encrypt(key, iv, plaintext, new Buffer([]));
            sock.write("<h:rt><h:d>" + plaintext + "</h:d></h:rt>");
            console.log("Sending Plain Text APDU : " + plaintext + "\r\n");            
        }
    }
}, 12345);