var net = require('net');

let host = null;
let client = null;

var server = net.createServer(function(socket) {
	socket.on('data', function(data) {
		if (data.toString() == 'host') {
			console.log('host defined.');
			host = socket;
		} else if (data.toString() == 'client') {
			client = socket;
		} else {
			if (host == null) {
				socket.write('no host')
			} else {
				host.write(data.toString());
			}
		}
	});

	process.on('uncaughtException', function (error) {
		console.log('socket closed.');
		console.log(error.stack);
	});
});

server.listen(socket-id-here, '0.0.0.0');
console.log("server listening on port 1337");