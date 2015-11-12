//reference code: http://www.openprocessing.org/sketch/223066
//<script src="js/dataProcess-Parse.js" type="text/javascript"></script>

var sparkles1 = [];
var sparkles2 = [];

//circle size - GPS data
var largeSize = 100;
var smallSize = 10;

//color
// var fromColor1;
// var toColor1;
// var fromColor2;
// var toColor2;
// var inter1;
// var inter2;
// var colorData = [];

//colors
alphaVal = 150;
var color1r;
var color1g;
var color1b;
var color2r;
var color2g;
var color2b;

//socket
var socket;

function setup() {
  createCanvas(displayWidth, displayHeight);

  //socket
  // socket = io.connect('http://192.168.1.176:8000');

  // socket.on('toP5',
  //   // When we receive data
  //   function(data) {
  //     //console.log("Got: " + data.r1 + " " + data.g1 + " " + data.b1 + " " + data.r2 + " " + data.g2 + " " + data.b2);
  //     //color1 = color(data.r1, data.g1, data.b1, alphaVal);
  //     //color2 = color(data.r2, data.g2, data.b2, alphaVal);
  //   color1r = data.r1;
  //   color1g = data.g1;
  //   color1b = data.b1;
  //   color2r = data.r2;
  //   color2g = data.g2;
  //   color2b = data.b2;
  //   console.log(color1r+color1g+color1b+color2r+color2g+color2b);
  //     //color1 = color('rgba(45, 40, 230, alphaVal)');
  //     //color2 = color('rgba(50, 240, 250, alphaVal)');
  //   }
  // );



  //create sparkle arrays
  for (var p = 0; p < displayWidth / 400; p++) {
    sparkles1.push(new Sparkle());
    sparkles2.push(new Sparkle());
  }
}

function draw() {
  background(0);


  for (var p = 0; p < sparkles1.length; p++) {
    for (var q = 0; q < sparkles1.length / 2; q++) {
      sparkles1[p].show((p + 1) * width / 4, (q + 1) * width / 4);
    }
  }

  for (var m = 0; m < sparkles2.length; m++) {
    for (var n = 0; n < sparkles2.length / 2; n++) {
      sparkles2[m].show((m + 1) * width / 4 - width / 8, (n + 1) * width / 4 + width / 8);
    }
  }
}

function Sparkle() {
  var x = 0; //x position
  var y = 0; //y position
  var s = 0; //circle size
  var interPoint = 0;
  var amt = 0;

  this.show = function(xTranslate, yTranslate) {
    var _xTranslate = xTranslate - displayWidth / 14;
    var _yTranslate = yTranslate - displayHeight / 4;

    resetMatrix();
    translate(_xTranslate, _yTranslate);
    for (var i = 0; i < 360; i += 90) {
      for (var j = 0; j < 360; j += 90) {
        x = sin(radians(i)) * 80 + sin(radians(j + frameCount)) * 80;
        y = cos(radians(i)) * 80 + cos(radians(j + frameCount)) * 80;
        s = map(dist(x, y, 0, 0), 0, 150, largeSize, smallSize);

        // amt += interPoint;
        // inter1 = lerpColor(fromColor1, toColor1, amt);
        // inter2 = lerpColor(fromColor2, toColor2, amt);
        // if (amt >= 1) {
        //   amt = 1;
        //   interPoint = -0.1;
        // } else if (amt <= 0) {
        //   amt = 0;
        //   interPoint = 0.1;
        // }
        // console.log(interPoint);

        stroke(230,226,226, alphaVal);
        //stroke(color1);
        strokeWeight(10);
        noFill();
        ellipse(1.5 * x, y, s, s);
        stroke(252, 13, 184, alphaVal);
        //stroke(color2);
        strokeWeight(5);
        ellipse(x, 1.5 * y, s, s);
      }
    }
  };
}