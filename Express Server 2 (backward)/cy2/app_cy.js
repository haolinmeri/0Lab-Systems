var bodyParser = require('body-parser');
var express = require("express");
var app = express();
var port = 8000;
var url='localhost'
var server = app.listen(port);
var io = require("socket.io").listen(server);
var serialport = require("serialport");
var SerialPort = serialport.SerialPort;
var port2 = new SerialPort("/dev/ttyAMA0", {
    baudrate: 9600,
    parser: serialport.parsers.readline("\n")
    }, false); 

var buttonState = 0;
var sensorVal = 0;

var Camera = require("camerapi");
var cam = new Camera();

app.use(express.static(__dirname + '/'));
console.log('Simple static server listening at' + url + ':' +port);

io.sockets.on('connection', function (socket) {

    socket.on('slider', function (data) {
            console.log(data);
  });   
    //console.log(data)
    port2.open(function(error) {

        if (error) {
            console.log('failed to open: ' + error);
        } else {
            port2.write("A");
            console.log('Serial open');
            port2.on('data', function(data) {
            //console.log(data);

            buttonState = data.substr(4, 1);
            sensorVal = data.substr(1, 3);

            // console.log(buttonState);
            // console.log(sensorVal);

            socket.emit('toScreen', { button: buttonState, sensor: sensorVal });
              
            port2.write("A");
            });
        } 
    });
});

//takePic()

function takePic() {
    if(buttonState == 1){
        console.log("taking picture now")
        cam.baseFolder('/home/pi/Desktop');
        cam.prepare({
            "timeout": 150,
            "width": 600,
            "height": 600,
            "quality": 85
        }).takePicture("myPic.jpg")
    }
}








