var bodyParser = require('body-parser');
var express = require("express");
var app = express();
var port = 8000;
var url='localhost'
var server = app.listen(port);
var io = require("socket.io").listen(server);
var prompt = require('prompt');



app.use(express.static(__dirname + '/'));//serve diectory this file is in
console.log('Simple static server listening at '+url+':'+port);


io.sockets.on('connection', function (socket) {//open io connection

function receiving() {
  socket.on('toServer', function (data) { 
    console.log(data);
  });
}

  gettingInput();
  function gettingInput() {
    prompt.start();
    var receiveNow = false;
    //var message = 20;

    prompt.get(['squareSize'], function(err, result) {
      var message = result.squareSize;
      
      if (message == 'p5'){
        receiveNow = true;
        if(receiveNow) {
        receiving();
          //clearTimeout(receiveData);
          console.log(receiveNow);
        }

        gettingInput();
        //setTimeout(gettingInput(), 2000);
        //setTimeout(function(){message == "20", 2000});
        //console.log("view data now");
      } else {
        
        console.log("The square size is "+message);
        socket.emit('toP5', {size: message});
        gettingInput();



      // socket.on('toServer', function (data) { 
      //   console.log(data);
      // });
      }
    });
  }

  // socket.emit('toP5', { x: 400, y: 400}); 

});
