var socket;

var circleSize = 80;

var obstacles = [];

var playerPos;

var inputSize = 20;

function setup() {
  createCanvas(windowWidth, windowHeight);

  socket = io.connect('http://localhost:8000');

  for (var i = 0; i < 200; i++) {
    obstacles.push(new Obstacles(random(20, windowWidth - 20), random(20, windowHeight - 20)));
  }

}

function draw() {
  background(255);
  noStroke();
  fill(245, 245, 25);
  playerPos = createVector(0.05 * mouseX + 0.95 * pmouseX, 0.05 * mouseY + 0.95 * pmouseY);
  ellipse(mouseX, mouseY, circleSize, circleSize);

  for (var p = 0; p < obstacles.length; p++) {
    obstacles[p].display();
    obstacles[p].move();
    obstacles[p].collide();
  }

  socket.on('toP5',
    function(data) {
      inputSize = parseInt(data.size);
      console.log(inputSize);
    }
  );
  
  socket.emit('toServer', { playerX: playerPos.x, playerY: playerPos.y});
}

function Obstacles(xPos, yPos) {
  var location = createVector(0, 0);
  var velocity = createVector(0, 0);
  var acceleration = createVector(1, 1);
  location.x = xPos;
  location.y = yPos;

  this.display = function() {
    noStroke();
    fill(200, 100, 255);
    rectMode(CENTER);
    rect(location.x, location.y, inputSize, inputSize);
  }

  this.move = function() {
    velocity.add(acceleration);
    //velocity.limit(maxSpeed);
    velocity.rotate(random(0, PI));
    location.add(velocity);
    acceleration.mult(0);
  }

  this.collide = function() {
    if (location.y + inputSize >= windowHeight) {
      velocity.y *= -1;
    }

    var distance = location.dist(playerPos);
    //print(distance);

    if (distance <= circleSize) {
      if (mouseX - pmouseX < 0) {
        location.x -= 10;
      } else if (mouseX - pmouseX > 0) {
        location.x += 10;
      }
      if (mouseY - pmouseY < 0) {
        location.y -= 10;
      } else if (mouseY - pmouseY > 0) {
        location.y += 10;
      }
    }
  }

  this.reset = function() {
    location.x = random(20, windowWidth - 20);
    location.y = random(20, windowHeight - 20);
    inputSize = 20;
  }
}

function keyPressed() {
  for (var q = 0; q < obstacles.length; q++) {
    obstacles[q].reset();
  }
}