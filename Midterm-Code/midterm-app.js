//parse
var Parse = require('node-parse-api').Parse;
var APP_ID = "JW9UKDypmsZFChBJ9xTAkBShX6n02neKIrRws45K";
var MASTER_KEY = "SfUvaj4SmtBpHkwaxAfoJMLoGu6xlJBCj0adtqw5";
var appParse = new Parse(APP_ID, MASTER_KEY);

//server and socket
var bodyParser = require('body-parser'); 
var express = require("express");
var serialport = require("serialport"); 
var app = express(); 
var port = 8000; 
var url='localhost' 
var server = app.listen(port);
var io = require("socket.io").listen(server);
var SerialPort = serialport.SerialPort; // create instance of serialport
var port2 = new SerialPort("/dev/ttyAMA0", { // define serial port to listen for data
  baudrate: 9600, // define rate of data tansfer
  parser: serialport.parsers.readline("\n") // read any data on serial untill end of line "\n"
}, false); 

app.use(express.static(__dirname + '')); // serve all contents of directory this file is in
console.log('Simple static server listening at '+url+':'+port); // print to console url (ip) and port used


io.sockets.on('connection', function (socket) { // start socket communication

// socket.on('toSerial', function (data) { // listen (on) to socket comm.
//     console.log(data); // print contents of socket to console
//   });

port2.open(function(error) { // start serial communication
  if (error) {
    console.log('failed to open: ' + error); // if serial communication fails
  } else { //if serial communication sucessfull do contents below
    console.log('Serial open'); //write "Serial open" to console
    port2.on('data', function(data) { // listen for data form serial
    console.log(data); //write all the data to  console
  //   result = data.split(',') // split data using "," as delimiter in to result array
  //   result[3] // index 3 of results array
    //socket.emit('toP5', { r: result[1], g: result[2], b: result[3] }); 
    socket.emit('toP5', { r: rRaw[0], g: gRaw[1], b: bRaw[2] }); 
    });
	}
});
});


var rRaw = [100, 44, 55];
var gRaw = [100, 45, 56];
var bRaw = [100, 46, 57];
//insert objects

var insertObject = function() {
	for (var j = 0; j < rRaw.length; j++){
		appParse.insert('colorData', { redValue: rRaw[j], greenValue: gRaw[j], blueValue: bRaw[j]}, function (err, response) {
			//console.log(response);
		});
	}
}

var rArray = new Array();
var gArray = new Array();
var bArray = new Array();

//find all the color data and sort the numbers from small to large
var findObject = function() {
appParse.find('colorData', '', function (err, response) {
		for(var i = 0; i < response.results.length; i++) {
			var r = response.results[i].redValue;
			var g = response.results[i].greenValue;
			var b = response.results[i].blueValue;

			rArray.push(r);
			gArray.push(g);
			bArray.push(b);

			//console.log(typeof(g));
		}
		sortFunction(rArray);
		sortFunction(gArray);
		sortFunction(bArray);

});
}

//sort the numbers for further process
function sortFunction(valueArray) {
	valueArray.sort(function(a, b){return a-b});
    console.log(valueArray);
}

appParse.deleteAll('colorData', function (err, response) {
  // response = {} 
});

//delete first and then insert and finally find the objects
setTimeout(insertObject, 500);
setTimeout(findObject, 1000);

// appParse.find('colorData', {createdAt: '2015-10-25T05:57:34.253Z'}, function (err, response) {
//   console.log(response);
// });





