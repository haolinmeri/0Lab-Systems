var socket;

var playerPos;
var _enemyPos;

var playerSize;
var enemySize;

var avatar;
var enemy;
// var enemyPack = [];

var safeDist;
var attackDist;
var fireDist;

var bulletList = [];

//fire bullet boolean
var bullet;

//enemy dies boolean
var die;

var shock;

var playerSpeed;
var transparency; //enemy's transparency

//images
var face1;
var face2;
var money;
var share;
var wait;
var ad;

var tileSize;

var resetTimes;
var gameover;

function setup() {
  w = windowWidth;
  h = windowHeight;
  createCanvas(w, h);

  socket = io.connect('http://localhost:8000');

  playerPos = createVector(random(0, w), random(0, h));
  bullet = false;
  die = false;
  shock = false;
  playerSpeed = 0.5;
  playerSize = 120;
  transparency = 255;

  avatar = new Avatar();

  enemy = new Enemy(random(0, w), random(0, h), int(random(0, 4)));

  for (var i = 0; i < 150; i++) {
    bulletList.push(new Bullet());
  }

  face1 = loadImage("data/face1.png");
  face2 = loadImage("data/face2.png");
  money = loadImage("data/money.png");
  wait = loadImage("data/wait.png");
  ad = loadImage("data/ad.png");
  share = loadImage("data/share.png");
  winScreen = loadImage("data/winScreen.png");
  failScreen = loadImage("data/failScreen.png");

  tileSize = 50;
  resetTimes = 0;
  gameover = false;
}

function draw() {
  background(255);


  for (var a = 0; a < w; a += tileSize) {
    for (var b = 0; b < h; b += tileSize) {
      noStroke();
      fill(245, 130, 125, 40);
      rect(a, b, tileSize - 20, tileSize - 20);


    }
  }

  socket.on('toP5',
    function(data) {

      //console.log(data);
      if (data.xMoveL == 1) {
        playerPos.x -= playerSpeed;
      }
      if (data.xMoveR == 1) {
        playerPos.x += playerSpeed;
      }
      if (data.ZMoveU == 1) {
        playerPos.y -= playerSpeed;
      }
      if (data.ZMoveD == 1) {
        playerPos.y += playerSpeed;
      }

      if (data.fireSignal == 1) {
        bullet = true;
      } else {
        bullet = false;
      }

    });

  avatar.show();
  avatar.collide();

  enemy.show();
  enemy.move();
  enemy.collide();

  if (bullet) {
    for (var q = 0; q < bulletList.length; q++) {
      bulletList[q].move();
      bulletList[q].show();
      bulletList[q].collide();
    }
  }


  //console.log(die);
  if (die) {
    enemy.reset();
    die = false;
    resetTimes ++;
  }
  //console.log(resetTimes);
  
  if (shock) {
    socket.emit('toServer', {
      attack: shock
    });
  }
  
  //gameover
  //console.log(gameover);
  if (gameover) {
    imageMode(CORNER);
    image(failScreen, 0, 0, w, h);
  }
  //winning
  if (resetTimes == 3) {
    imageMode(CORNER);
    image(winScreen, 0, 0, w, h);
  }
  
}

function keyTyped() {
  if (key === 'a') {
    playerPos.x -= 5;
  } else if (key === 'd') {
    playerPos.x += 5;
  } else if (key === 'w') {
    playerPos.y -= 5;
  } else if (key === 's') {
    playerPos.y += 5;
  } else if (key === 'k') {
    bullet = true;
  }
}

function mousePressed() {
  bullet = true;
}


function Avatar() {
  this.show = function() {
    noStroke();
  };

  this.collide = function() {
    if (playerPos.x + playerSize / 2 >= w) {
      playerPos.x = w - playerSize / 2;
    } else if (playerPos.x - playerSize / 2 <= 0) {
      playerPos.x = playerSize / 2;
    }

    if (playerPos.y + playerSize / 2 >= h) {
      playerPos.y = h - playerSize / 2;
    } else if (playerPos.y - playerSize / 2 <= 0) {
      playerPos.y = playerSize / 2;
    }
  };
}

function Enemy(posX, posY, mode) {
  var amt;
  // var transparency = 255;
  var enemyPos = createVector(0, 0);
  enemyPos.x = posX;
  enemyPos.y = posY;
  _enemyPos = enemyPos;
  var _mode = mode;

  this.show = function() {
    noStroke();

    //4 modes: 0 - money, 1 - share, 2 - wait, 3 - ads
    imageMode(CENTER);
    if (_mode == 0) {
      //fill(20, 255, 95, transparency);
      enemySize = 80;
      tint(255, transparency);
      image(money, enemyPos.x, enemyPos.y, enemySize, enemySize);
    } else if (_mode == 1) {
      //fill(90, 120, 250, transparency);
      enemySize = 120;
      tint(255, transparency);
      image(share, enemyPos.x, enemyPos.y, enemySize, enemySize);
    } else if (_mode == 2) {
      //fill(255, 255, 50, transparency);
      enemySize = 50;
      tint(255, transparency);
      image(wait, enemyPos.x, enemyPos.y, enemySize, enemySize);
    } else if (_mode == 3) {
      //fill(255, 95, 55, transparency);
      enemySize = 140;
      tint(255, transparency);
      image(ad, enemyPos.x, enemyPos.y, enemySize, enemySize);
    }
    //ellipse(enemyPos.x, enemyPos.y, enemySize, enemySize);
  };

  this.move = function() {
    if (safeDist > 0) {
      if (_mode == 0) {
        amt = 0.01;
      } else if (_mode == 1) {
        amt = 0.005;
      } else if (_mode == 2) {
        amt = 0.004;
      } else if (_mode == 3) {
        amt = 0.007;
      }
      enemyPos.x = lerp(enemyPos.x, playerPos.x, amt);
      enemyPos.y = lerp(enemyPos.y, playerPos.y, amt);
    }
  };

  this.collide = function() {
    safeDist = enemyPos.dist(playerPos);
    if (safeDist < (playerSize + enemySize) / 2 && playerSize > 1) {
      imageMode(CENTER);
      tint(255, 255);
      image(face2, playerPos.x, playerPos.y, playerSize * 1.1, playerSize * 1.1);
      playerSize -= 0.2;
      shock = true;
      
      if (playerSize <= 1) {
        playerSize = 0.1; //to avoid the bug from image, when you set the size to 0, it just displays the original size
        // console.log("player died");
        gameover = true;
      } else {
        gameover = false;
      }

    } else {
      //playerSize = 100;
      imageMode(CENTER);
      tint(255, 255);
      image(face1, playerPos.x, playerPos.y, playerSize, playerSize);
      shock = false;
    }
  };

  this.reset = function() {
    _mode = int(random(0, 4));
    enemyPos.x = random(0, w);
    enemyPos.y = random(0, h);
    transparency = 255;
  };
}


function Bullet() {
  var bulletPos = createVector(0, 0);
  var bulletSize;
  var radius = 150;
  var origin = createVector(0, 0);
  var divider;
  var bulletAlpha;


  this.move = function() {
    origin.x = playerPos.x;
    origin.y = playerPos.y;

    bulletPos.x = random(origin.x - 2 * radius, origin.x + 2 * radius);
    bulletPos.y = random(origin.y - 2 * radius, origin.y + 2 * radius);

    _bulletPos = bulletPos;
  };

  this.show = function() {
    divider = bulletPos.dist(origin);
    bulletSize = map(divider, 0, radius, 16, 1);
    //bulletAlpha = map(divider, 0, radius, 255, 80);

    noStroke();
    fill(255, 125, random(20, 160), 120);

    //draw bullet particles within a circle
    if (divider <= radius && divider >= playerSize / 2) {
      ellipse(bulletPos.x, bulletPos.y, bulletSize, bulletSize);
    }
  };

  this.collide = function() {
    attackDist = origin.dist(_enemyPos);
    //console.log(attackDist);
    if (attackDist <= (enemySize / 2) + radius) {
      //console.log("hit");
      transparency -= 0.01;
      //console.log(transparency);

      if (transparency <= 0) {
        //console.log("enemy died");
        die = true;
      }
    }

  };
}


