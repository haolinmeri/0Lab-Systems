var socket;
var url='192.168.1.9';
var port=8000
//var url='http//47.18.216.182';
//$(document).ready(function(){
	socket = io.connect(url+':'+port);
	socket.on('toScreen', function (data) {
		console.log(data);
		if(data.button == 1) {
			document.getElementById("buttonOutput").style.backgroundColor = "green";
		} else {
			document.getElementById("buttonOutput").style.backgroundColor = "yellow";
		}
			document.getElementById("distanceOutput").style.width = data.sensor + "%";

		
	});
//When color button is clicked emit data to socket
// function toColor(){
// 	var rval = document.getElementById('rval').value;
// 	var gval = document.getElementById('gval').value;
// 	var bval = document.getElementById('bval').value;
// 	socket.emit('toColor', { r: rval, g: gval, b:bval });
// }

//var x

// function sliderChange(servoVal) {
//     	servoVal = document.getElementById("servoAngle").value;
//     	document.getElementById("valueDisplay").innerHTML = x;
// 	}

function outputUpdate(vol) {
	document.querySelector('#volume').value = vol;
	//socket.emit('slider', { angleVal: vol });
	console.log(vol);
	socket.emit('slider', { angleVal: vol });
}

