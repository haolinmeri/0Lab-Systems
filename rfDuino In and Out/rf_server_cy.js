
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
}, false); // this is the openImmediately flag [default is true]


app.use(express.static(__dirname + '/'));
console.log('Simple static server listening at '+url+':'+port2);

var potVal;

port2.open(function(error) {

  if (error) {
    console.log('failed to open: ' + error);
  } else {
    port2.write("A");
    console.log('Serial open');
    port2.on('data', function(data) {
    //console.log('data length: ' + data.length);
    console.log(data);
   
    port2.write("A");
    });
}
  
});

io.sockets.on('connection', function (socket) {
  socket.on('toColor', function (data) {
    //console.log(data);
    //console.log("You sent R=" + data.r + " G="+ data.g + " B="+ data.g);
    socket.emit('toScreen', { r: data.r, g: data.g, b: data.b });     

  });
});


                          








