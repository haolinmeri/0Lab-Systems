var serialport = require("serialport");
var SerialPort = serialport.SerialPort;
var port = new SerialPort("/dev/ttyAMA0", {
  baudrate: 9600,
  parser: serialport.parsers.readline("\n")
}, false); // this is the openImmediately flag [default is true]

var GPIO = require('onoff').Gpio,
  led = new GPIO(17, 'out');
 // led2 = new GPIO(27, 'out');

var buttonState;

var led2 = require('pi-blaster.js');

var potVal;

port.open(function(error) {

  if (error) {
    console.log('failed to open: ' + error);
  } else {
    port.write("A");
    console.log('Serial open');
    port.on('data', function(data) {
    //console.log('data length: ' + data.length);
    //console.log(data);
    var buttonStateStr = data.substr(5,1);
    buttonState = parseInt(buttonStateStr);

    var potValStr = data.substr(7,4);
    potVal = parseInt(potValStr);

    light();
    angle();
   
    port.write("A");
    });
}
  
});


function light(err, state) {
	console.log(buttonState);
	if(buttonState == 1) {
		led.writeSync(1);
	} else {
		led.writeSync(0);		
	}
}                           

function angle(err, state) {
	//led2.setPwm(22, 0.5);
	//console.log(1/(potVal+1));
	//if(potVal < 600) {
	//	led2.writeSync(1);
	//} else {
	//	led2.writeSync(0.4);
	//}
}







