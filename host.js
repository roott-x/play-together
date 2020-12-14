const { getDiffieHellman } = require('crypto');
var net = require('net');
var { listConnectedJoyCons } = require('switch-joy-con');
const ViGEmClient = require('vigemclient');

let vgclient = new ViGEmClient();
vgclient.connect();

let devices = listConnectedJoyCons();
if (!devices.length) {
	console.log('please connect a LEFT joycon. press ctrl+c to exit if you cannot.');
	while (!devices.length) {
		devices = listConnectedJoyCons();
	}
}

let left = devices[0].open();
console.log(left.side + ' joycon connected.\n');

if (left.side != 'left') {
	console.log('error: you connected a right joycon. please connect a left joycon and try again.');
	process.exit(1);
}

console.log(devices[0]);
left.setPlayerLEDs(1);
let prevStateLeft = left.buttons;
let prevStateRight = { a: false,
                       b: false,
                       x: false,
                       y: false,
                       plus: false,
                       home: false,
                       sl: false,
                       sr: false,
                       r: false,
                       zr: false,
                       analogStickPress: false,
                       analogStick: 8 };

// create emulated DS4 controller and connect it
let controller = vgclient.createDS4Controller();
controller.connect();
controller.updateMode = 'manual';

// check the differences between the previous state and the current state of the joycon
function checkDifferences(prev, curr) {
    let diff = [];
    for (let [key, value] of Object.entries(curr)) {
        if (curr[key] != prev[key]) {
            diff.push(key);
        }
    }
    return diff;
}

function generateCurr(diff) {
    let curr = Object.assign({}, prevStateRight);
    let diff_keys = Object.keys(diff);
    diff_keys.map((x) => curr[x] = diff[x]);
    return curr;
}

function toggleLeft(button, curr) {
    switch (button) {
        case 'dpadUp':
            curr[button] ? controller.axis.dpadVert.setValue(1) : controller.axis.dpadVert.setValue(0);
            controller.update();
            break;
        case 'dpadDown':
            curr[button] ? controller.axis.dpadVert.setValue(-1) : controller.axis.dpadVert.setValue(0);
            controller.update();
            break;
        case 'dpadLeft':
            curr[button] ? controller.axis.dpadHorz.setValue(-1) : controller.axis.dpadHorz.setValue(0);
            controller.update();
            break;
        case 'dpadRight':
            curr[button] ? controller.axis.dpadHorz.setValue(1) : controller.axis.dpadHorz.setValue(0);
            controller.update();
            break;
        case 'minus': 
            curr[button] ? controller.button.SHARE.setValue(1) : controller.button.SHARE.setValue(0);
            controller.update();
            break;
        case 'screenshot':
            break;
        case 'sl':
            break;
        case 'sr':
            break;
        case 'l':
            curr[button] ? controller.button.SHOULDER_LEFT.setValue(1) : controller.button.SHOULDER_LEFT.setValue(0);
            controller.update();
            break;
        case 'zl':
            curr[button] ? controller.button.TRIGGER_LEFT.setValue(1) : controller.button.TRIGGER_LEFT.setValue(0);
            controller.update();
            break;
        case 'analogStickPress':
            curr[button] ? controller.button.THUMB_LEFT.setValue(1) : controller.button.THUMB_LEFT.setValue(0);
            controller.update();
            break;
        case 'analogStick':
            let value = curr[button];
            switch (value) {
                case 0:
                    controller.axis.leftX.setValue(1);
                    controller.axis.leftY.setValue(0);
                    controller.update();
                    break;
                case 1:
                    controller.axis.leftX.setValue(1);
                    controller.axis.leftY.setValue(-1);
                    controller.update();
                    break;
                case 2:
                    controller.axis.leftX.setValue(0);
                    controller.axis.leftY.setValue(-1);
                    controller.update();
                    break;
                case 3:
                    controller.axis.leftX.setValue(-1);
                    controller.axis.leftY.setValue(-1);
                    controller.update();
                    break;
                case 4:
                    controller.axis.leftX.setValue(-1);
                    controller.axis.leftY.setValue(0);
                    controller.update();
                    break;
                case 5:
                    controller.axis.leftX.setValue(-1);
                    controller.axis.leftY.setValue(1);
                    controller.update();
                    break;
                case 6:
                    controller.axis.leftX.setValue(0);
                    controller.axis.leftY.setValue(1);
                    controller.update();
                    break;
                case 7:
                    controller.axis.leftX.setValue(1);
                    controller.axis.leftY.setValue(1);
                    controller.update();
                    break;
                case 8:
                    controller.axis.leftX.setValue(0);
                    controller.axis.leftY.setValue(0);
                    controller.update();
                    break;
                default:
                    break;
            }
            break;
        default:
            break;
    }
}

function toggleRight(button, curr) {
    switch (button) {
        case 'a':
            curr[button] ? controller.button.CROSS.setValue(1) : controller.button.CROSS.setValue(0);
            controller.update();
            break;
        case 'b':
            curr[button] ? controller.button.CIRCLE.setValue(1) : controller.button.CIRCLE.setValue(0);
            controller.update();
            break;
        case 'x':
            curr[button] ? controller.button.TRIANGLE.setValue(1) : controller.button.TRIANGLE.setValue(0);
            controller.update();
            break;
        case 'y':
            curr[button] ? controller.button.SQUARE.setValue(1) : controller.button.SQUARE.setValue(0);
            controller.update();
            break;
        case 'plus':
            curr[button] ? controller.button.OPTIONS.setValue(1) : controller.button.OPTIONS.setValue(0);
            controller.update();
            break;
        case 'home':
            curr[button] ? controller.button.SPECIAL_PS.setValue(1) : controller.button.SPECIAL_PS.setValue(0);
            controller.update();
            break;
        case 'sl':
            break;
        case 'sr':
            break;
        case 'r':
            curr[button] ? controller.button.SHOULDER_RIGHT.setValue(1) : controller.button.SHOULDER_RIGHT.setValue(0);
            controller.update();
            break;
        case 'zr':
            curr[button] ? controller.button.TRIGGER_RIGHT.setValue(1) : controller.button.TRIGGER_RIGHT.setValue(0);
            controller.update();
            break;
        case 'analogStickPress':
            curr[button] ? controller.button.THUMB_RIGHT.setValue(1) : controller.button.THUMB_RIGHT.setValue(0);
            controller.update();
            break;
        case 'analogStick':
            let value = curr[button];
            switch (value) {
                case 0:
                    controller.axis.rightX.setValue(-1);
                    controller.axis.rightY.setValue(0);
                    controller.update();
                    break;
                case 1:
                    controller.axis.rightX.setValue(-1);
                    controller.axis.rightY.setValue(1);
                    controller.update();
                    break;
                case 2:
                    controller.axis.rightX.setValue(0);
                    controller.axis.rightY.setValue(1);
                    controller.update();
                    break;
                case 3:
                    controller.axis.rightX.setValue(1);
                    controller.axis.rightY.setValue(1);
                    controller.update();
                    break;
                case 4:
                    controller.axis.rightX.setValue(1);
                    controller.axis.rightY.setValue(0);
                    controller.update();
                    break;
                case 5:
                    controller.axis.rightX.setValue(1);
                    controller.axis.rightY.setValue(-1);
                    controller.update();
                    break;
                case 6:
                    controller.axis.rightX.setValue(0);
                    controller.axis.rightY.setValue(-1);
                    controller.update();
                    break;
                case 7:
                    controller.axis.rightX.setValue(-1);
                    controller.axis.rightY.setValue(-1);
                    controller.update();
                    break;
                case 8:
                    controller.axis.rightX.setValue(0);
                    controller.axis.rightY.setValue(0);
                    controller.update();
                    break;
                default:
                    break;
            }
            break;
        default:
            break;
    }
}

var client = new net.Socket();
client.connect(socket-id-here, 'server-ip-here', function () {
    console.log('connected to server.');
	client.write('host');

	client.on('data', function (data) {
		if (data.toString() == 'no host') {
			console.log('no host found. ending process.');
			process.exit(1);
        }
        console.log(data.toString());
        try {
            let right_changes = JSON.parse(data.toString());
            let curr = generateCurr(right_changes);
            let diff = checkDifferences(prevStateRight, curr);
            diff.map((x) => toggleRight(x, curr));    
            prevStateRight = curr;
        } catch (e) {
            let splitAt = (index) => (x) => [x.slice(0, index), x.slice(index)];
            let objs = [];
            let str = data.toString();
            for (let i = 0; i < str.length - 1; ++i) {
                if (str.charAt(i) === '}') {
                    if (str.charAt(i + 1) === '{') {
                        objs.push(splitAt(i + 1)(str)[0]);
                        str = splitAt(i + 1)(str)[1];
                        i = 0;
                    }
                }
                if (i === str.length - 2) {
                  objs.push(str);
                }
            }
            for (let j = 0; j < objs.length; j++) {
                let right_changes = JSON.parse(objs[j]);
                let curr = generateCurr(right_changes);
                let diff = checkDifferences(prevStateRight, curr);
                diff.map((x) => toggleRight(x, curr)); 
            }
        }
	});

	client.on('close', function () {
        left.close();
        controller.disconnect();
		console.log('connection closed by server.');
	});

});

controller.axis.dpadVert.setValue(0);
controller.axis.dpadHorz.setValue(0);
controller.axis.leftX.setValue(0);
controller.axis.leftY.setValue(0);
controller.axis.rightX.setValue(0);
controller.axis.rightY.setValue(0);

left.on('change', function () {
    let curr = left.buttons;
    let diff = checkDifferences(prevStateLeft, curr);
    console.log(curr);
    diff.map((x) => toggleLeft(x, curr));
    prevStateLeft = curr;
});