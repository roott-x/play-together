var { listConnectedJoyCons } = require('switch-joy-con');
var net = require('net');

// load devices and wait for a connected joycon
let devices = listConnectedJoyCons();
if (!devices.length) {
	console.log('please connect a RIGHT joycon. press ctrl+c to exit if you cannot.');
	while (!devices.length) {
		devices = listConnectedJoyCons();
	}
}

// open connected joycon
let joycon = devices[0].open();
console.log(joycon.side + ' joycon connected.\n');

// check if right joycon. if not, end program
if (joycon.side != 'right') {
	console.log('error: you connected a left joycon. please connect a right joycon and try again.');
	process.exit(1);
}

// device data + set leds to player 02 (bc the host would be player 01)
console.log(devices[0]);
joycon.setPlayerLEDs(1 + 2);

// check the differences between the previous state and the current state of the joycon
function checkDifferences(prev, curr) {
    let diff = {};
    for (let [key, value] of Object.entries(curr)) {
        if (curr[key] != prev[key]) {
            diff[key] = value;
        }
    }
    return diff;
}

// set the previous state for the buttons
let prevStateRight = joycon.buttons;

// create a new socket connection
var client = new net.Socket();
client.connect(socket-id-here, 'server-ip-here', function () {
	client.write('client');
	console.log('connected to server.');

	client.on('data', function (data) {
		if (data.toString() == 'no host') {
			console.log('no host found. ending process.');
			process.exit(1);
		}
		console.log(data.toString());
	});

	// whenever the button state of the joycon changes, send the update to the server
	joycon.on('change', function () {
		let curr = joycon.buttons;
		let diff = checkDifferences(prevStateRight, curr);
		console.log(diff);
		client.write(JSON.stringify(diff));
		prevStateRight = curr;
	});

	client.on('close', function () {
		joycon.close();
		console.log('connection closed by server.');
	});

});