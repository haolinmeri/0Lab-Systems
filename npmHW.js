var GPIO = require('onoff').Gpio,
	led = new GPIO(27, 'out'),
	button = new GPIO(4, 'in', 'both'),
	button2 = new GPIO(22, 'in', 'both');

var piblaster = require('pi-blaster.js');

var Camera = require("camerapi");

var cam = new Camera();

var isTurning = false;

function light(err, state) {
	if(state == 1) {
		led.writeSync(1);
		shot();
	} else {
		led.writeSync(0);
	}
}

function angle(err, state) {
	if(state == 1) {
		isTurning = true;
		if(isTurning) {
			for (var i = 0; i < 1; i+= 0.1) {
			piblaster.setPwm(0, i);
			}
		}
	} else {
		isTurning = false;
	}
}

button.watch(light);
button2.watch(angle);

function shot() {
	cam.baseFolder('/home/pi/Desktop');

	cam.prepare({
		"timeout": 150,
		"width": 600,
		"height": 600,
		"quality": 85
	}).takePicture("myPicture.jpg")
}

