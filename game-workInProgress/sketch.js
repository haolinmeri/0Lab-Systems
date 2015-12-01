var playerPos;
var _enemyPos;
//var _bulletPos;
var playerSize;
var enemySize;

var avatar;
var enemy;
// var enemyPack = [];

var safeDist;
var attackDist;
//var peerDist;
var fireDist;

var bulletList = [];

var origin;

var fire;

function setup() {
  createCanvas(displayWidth, displayHeight);
  origin = createVector(0, 0);
  playerPos = createVector(random(0, displayWidth), random(0, displayHeight));
  fire = false;

  playerSize = 100;
  enemySize = 80;

  avatar = new Avatar();
  enemy = new Enemy(random(0, displayWidth), random(0, displayHeight));
  enemy.prime();

  // for (var i = 0; i < 4; i++) {
  //   enemyPack.push(new Enemy(random(0, displayWidth), random(0, displayHeight), i));
  //   enemyPack[i].prime();

  // }

  // for (var j = 0; j < 160; i++) {
  //   bulletList.push(new Bullet());
  //   bulletList[j].prime();
  //   // attackDist = _bulletPos.dist(_enemyPos);
  //   //attackDist = bulletList[j].bulletPos.dist(enemyPack[i].enemyPos);
  // }

  for (var i = 0; i < 80; i++) {
    bulletList.push(new Bullet());
    bulletList[i].prime();
  }

}

function draw() {
  background(255);
  //playerPos = createVector(mouseX, mouseY);

  // for (var m = 0; m < enemyPack.length; m++) {
  //   enemyPack[m].show();
  //   enemyPack[m].move();
  //   enemyPack[m].collide();
  //   //peerDist = enemyPack[j].dist(enemyPack)
  //   //safeDist = dist(playerPos.x, playerPos.y, enemyPack[j].enemyPos.x, enemyPack[j].enemyPos.y);

  // }

  enemy.show();
  enemy.move();
  //console.log(_enemyPos);
  enemy.collide();

  avatar.show();

  if (fire) {
    for (var q = 0; q < bulletList.length; q++) {
      bulletList[q].move();
      bulletList[q].show();
      bulletList[q].collide();
      bulletList[q].reset();
      //attackDist = _bulletPos.dist(_enemyPos);
    }
  }


  // avatar.collide();

  //safeDist = dist(playerPos.x, playerPos.y, _enemyPos.x, _enemyPos.y);


}

function keyTyped() {
  var speed = 15;
  if (key === 'a') {
    playerPos.x -= speed;
    //console.log(playerPos.x);
  } else if (key === 'd') {
    playerPos.x += speed;
  } else if (key === 'w') {
    playerPos.y -= speed;
  } else if (key === 's') {
    playerPos.y += speed;
  }
}

function mouseClicked() {
  //origin.x = playerPos+100;
  //origin.y = playerPos.y;
  // fill(20,30,30);
  // ellipse(300,300, 20,20);

  // for (var q = 0; q < bulletList.length; q++) {
  //   bulletList[q].move();
  //   bulletList[q].show();
  //   bulletList[q].collide();
  //   //attackDist = _bulletPos.dist(_enemyPos);
  // }
  fire = true;
  //console.log(origin);
}

function Avatar() {
  this.show = function() {
    noStroke();
    fill(105, 20, 255);
    ellipse(playerPos.x, playerPos.y, playerSize, playerSize);
  };

  this.collide = function() {
    // if (safeDist < (playerSize + enemySize) / 2) {
    //   playerSize += random(-10, 10);
    // } else {
    //   playerSize = 100;
    // }
  }
}

function Enemy(posX, posY, mode) {
  var amt = 0.005;
  var transparency = 255;
  // var enemyPos = create
  var enemyPos = createVector(0, 0);

  this.prime = function() {
    enemyPos.x = posX;
    enemyPos.y = posY;
    _enemyPos = enemyPos;
  }

  this.show = function() {
    noStroke();
    fill(20, 255, 95, transparency);
    ellipse(enemyPos.x, enemyPos.y, enemySize, enemySize);
  };

  this.move = function() {
    if (safeDist > 0) {
      enemyPos.x = lerp(enemyPos.x, playerPos.x, amt);
      enemyPos.y = lerp(enemyPos.y, playerPos.y, amt);
    }
  };

  this.collide = function() {
    //safeDist = dist(playerPos.x, playerPos.y, enemyPos.x, enemyPos.y);
    safeDist = enemyPos.dist(playerPos);
    if (safeDist < (playerSize + enemySize) / 2) {
      transparency -= 1;
      //console.log("beep");
      //enemySize += random(-10, 10);
      playerSize += random(-10, 10);
    }
    // if (safeDist < (playerSize + enemySize) / 2) {
    //   playerSize += random(-10, 10);
    else {
      playerSize = 100;
    }


  };

  this.reset = function() {

  };
}

function Bullet() {
  var bulletPos = createVector(0, 0);
  var originVel = createVector(0, 1);
  var bulletSize;
  var radius;
  //var origin = createVector(0, 0);
  var divider;

  this.prime = function() {
    //bulletSize = random(8, 14);
    radius = 25;
    // origin.x = playerPos.x;
    // origin.y = playerPos.y;
    origin.x = playerPos.x+100;
    origin.y = playerPos.y;

  }

  this.move = function() {
    // origin.x = 100;
    // origin.y =  100;
    // origin.x = playerPos.x + 100;
    // origin.y = playerPos.y;
    //console.log(originVel);
    
    // origin.x = playerPos.x+100;
    // origin.y = playerPos.y;

    //console.log(origin);

    bulletPos.x = random(origin.x - 2 * radius, origin.x + 2 * radius);
    bulletPos.y = random(origin.y - 2 * radius, origin.y + 2 * radius);
    //bulletPos.add(bulletVel);
    //console.log(origin);

    origin.x += originVel.x;
    //origin.y += originVel.y;

    _bulletPos = bulletPos;

    divider = bulletPos.dist(origin);
    bulletSize = map(divider, 0, radius, 8, 1);
  }

  this.show = function() {
    noStroke();
    fill(random(20, 160), 20, 255, 40);

    if (divider <= radius) {
      ellipse(bulletPos.x, bulletPos.y, bulletSize, bulletSize);
    }
  }

  this.collide = function() {
    attackDist = bulletPos.dist(_enemyPos);
    //console.log(attackDist);
    if (attackDist <= enemySize / 2) {
      //console.log("hit");
    }
  }

  this.reset = function() {
    fireDist = bulletPos.dist(playerPos);
    if (fireDist > 2 * playerSize) {
      fire = false;
      origin.x = 100;
      origin.y = 100;
    }
  }
}

function BulletCloud() {

}