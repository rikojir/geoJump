var game = new Phaser.Game(800, 340, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

var player;
var cursors;
var group;
var enemies;
var emitter = [];

/* Empty weapons array, name and currentWeapon index, we could implement multiple weapons */
var weapons = [];
var currentWeapon = 0;
var weaponName = null;

var Weapon = {};

/* Tilemap and layer */
var map;
var layer;


/////////////////////////////////////////////////////////////////
///////////////////////     Bullet Setup    /////////////////////
/////////////////////////////////////////////////////////////////


//  Our core Bullet class
//  This is a simple Sprite object that we set a few properties on
//  It is fired by all of the Weapon classes
var Bullet = function (game, key) {
  Phaser.Sprite.call(this, game, 0, 0, key);
  this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
  this.anchor.set(0.5);
  this.checkWorldBounds = true;
  this.outOfBoundsKill = true;
  
  /* Important : We only have 64 bullets, so we need to destroy them as soon
  as they leave the camera bounds, not only the world bounds (20000 px width!) */
  this.outOfCameraBoundsKill = true;
  this.autoCull = true;
  
  this.exists = false;
  this.tracking = false;
  this.scaleSpeed = 0;
};

Bullet.prototype = Object.create(Phaser.Sprite.prototype);
Bullet.prototype.constructor = Bullet;

Bullet.prototype.fire = function (x, y, angle, speed, gx, gy) {
  gx = gx || 0;
  gy = gy || 0;
  this.reset(x, y);
  this.scale.set(1);
  this.game.physics.arcade.velocityFromAngle(angle, speed, this.body.velocity);
  this.angle = angle;
  this.body.gravity.set(gx, gy);
};

Bullet.prototype.update = function () {
  if (this.tracking) {
    this.rotation = Math.atan2(this.body.velocity.y, this.body.velocity.x);
  }
  if (this.scaleSpeed > 0) {
    this.scale.x += this.scaleSpeed;
    this.scale.y += this.scaleSpeed;
  }
};



///////////////////////////////////////////////////////////////////////////
//  Single-Bullet-Weapon : A single bullet is fired in front of the ship //
///////////////////////////////////////////////////////////////////////////

Weapon.SingleBullet = function (game) {
  Phaser.Group.call(this, game, game.world, 'Single Bullet', false, true, Phaser.Physics.ARCADE);
  this.nextFire = 0;
  this.bulletSpeed = 600;
  this.fireRate = 100;
  for (var i = 0; i < 64; i++) {
    this.add(new Bullet(game, 'pixel'), true);
  }
  return this;
};

Weapon.SingleBullet.prototype = Object.create(Phaser.Group.prototype);
Weapon.SingleBullet.prototype.constructor = Weapon.SingleBullet;

Weapon.SingleBullet.prototype.fire = function (source) {
  if (this.game.time.time < this.nextFire) {
    return;
  }
  var x = source.x + 10;
  var y = source.y + 10;
  this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 0);
  this.nextFire = this.game.time.time + this.fireRate;
};


////////////////////////////////////////////////////
//  Core game Loop: preload, create, update       //
////////////////////////////////////////////////////

function preload() {

    game.load.image('background','assets/debug-grid-1920x1920.png');
    game.load.image('player','assets/player.png');
    game.load.image('pixel', 'assets/pixel.png');
    game.load.image('enemy', 'assets/enemy.png');
    game.load.image('tileset', 'assets/5x5x20x20FarbPalette.png');
    game.load.tilemap('map1', 'assets/geoJump2.json', null, Phaser.Tilemap.TILED_JSON);

}

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.stage.backgroundColor = '#3498db';
  
    weapons.push(new Weapon.SingleBullet(this.game));

    player = game.add.sprite(10, game.world.centerY, 'player');
    game.physics.arcade.enable(player);
    
    createWorld();
  
    addMobileInputs();
  
    createEnemies();
  
    setupEmitters();
  
    player.body.gravity.y = 3000;
    //player.body.collideWorldBounds = true;
    player.body.velocity.x = 0;

    cursors = game.input.keyboard.createCursorKeys();

    game.camera.follow(player);

}

function createWorld() {
    // Create the tilemap
    map = game.add.tilemap('map1');
  
    // Add the tileset to the map
    map.addTilesetImage('tileset');
  
    // Create the layer, by specifying the name of the Tiled layer
    layer = map.createLayer('Tile Layer 1');
  
    // Set the world size to match the size of the layer
    layer.resizeWorld();
  
    //Enable collisions for the first element of our tileset (the blue wall)
    map.setCollision(6);
    map.setCollision(24);
    map.setCollision(4);
    //map.setTileIndexCallback(4, port, this);
  
    var portLocations360 = [];
    portLocations360.push(
      [283, 15],
      [460, 10],
      [492, 10],
      [698, 10]
    );
    for (var i = 0; i < portLocations360.length; i++) {
      map.setTileLocationCallback(portLocations360[i][0], portLocations360[i][1], 1, 1, function() {
        port(player.x + 360, player.y) }, this);
    }
  
  
    var portLocations220 = [];
    portLocations220.push(
      [541, 7],
      [541, 15]
    );
    for (var j = 0; j < portLocations220.length; j++) {
      map.setTileLocationCallback(portLocations220[j][0], portLocations220[j][1], 1, 1, function() {
        port(player.x + 220, player.y) }, this);
    }
}

function createEnemies() {
  enemies = game.add.physicsGroup();
  
  for (var i = 0; i < 7; i++) {
    var c = enemies.create(540, 300 - 20 * i, 'enemy');
    c.body.immovable = true;
  }
}

function setupEmitters() {
  
  for (var i = 0; i < 5; i++) {
    //Add an emitter at 0/0, we don't know where the animation will be needed by now
    var emittr = game.add.emitter(0, 0, 20);
    //Use the pixel.png image as a particle
    emittr.makeParticles('pixel');
    //When firing, choose random x/y speed between -150 and 150
    emittr.setYSpeed(-150, 150);
    emittr.setXSpeed(-150, 150);
    //No gravity for pixels, otherwise the pixels will fall down
    emittr.gravity = 0;
    emittr.gravity = 0;
    
    emitter.push(emittr);
  }
  console.log(emitter);
}

function fireEmitter(xCoordinate, yCoordinate) {
    for (var i = 0; i < emitter.length; i++) {
    if (emitter[i].x == 0 && emitter[i].y == 0) {
      var emitterIndex = i;
      break;
    }
  }
  console.log("Emitter fired: " + emitterIndex);
  // Set the position of the emitter to the enemies position
  emitter[i].x = xCoordinate;
  emitter[i].y = yCoordinate;
  // true = all particles at once, 300ms lifespan for each particle, frequency null because all particles explode at once, 15 particles will explode
  emitter[i].start(true, 1000, null, 10);
  
  /* After 200ms reset the position of the emittr, otherwise it will be immediately reset to 0/0 and be selected for the next collision call, but since the animation will still be running then, nothing happens, so with 200ms waiting the next emitter will be chosen, and a second (third, fourth and fifth) animation can be fired simultaneously */
  game.time.events.add(200, function() {
    emitter[i].x = 0;
    emitter[i].y = 0;
  }, this);
  
}
  
function port(x, y) {
    console.log("Porting");
    //player.x = player.x + 360;
    game.add.tween(player).to( { x: x, y: y }, 100, null, true);
}

function processHandler (bullet, enemies) {

    //return true;

}

function collisionHandler (bullet, pixel) {
    if (pixel.frame == 0)
    {
      fireEmitter(pixel.x, pixel.y);
      pixel.kill();
      bullet.kill();
    }
}

function handleTouchInput(pointer) {
  //pointer param is the pointer that fired the event
  if (pointer.x < game.camera.width / 2) {
    // Change gravity
    player.body.gravity.y = -player.body.gravity.y;
    console.log("Gravity changed");
  }
  else {
    // Shoot
      weapons[currentWeapon].fire(player);
  }
}

function update() {

    /* Tell Phaser that the player and the walls should collide */
    game.physics.arcade.collide(player, layer);
    game.physics.arcade.overlap(player, enemies, playerDie, null, this);

    /* Collision between the weapons[0] group ( = the bullets of the SingleWeapon) and the enemies group */
    game.physics.arcade.collide(weapons[0], enemies, collisionHandler, processHandler, this);

    /* Control */
    game.input.onDown.add(handleTouchInput, this);
    
  
  
    if (cursors.up.isDown)
    {
        player.body.gravity.y = -3000;
        //player.body.velocity.y = -300;
    }
    else if (cursors.down.isDown)
    {
        player.body.gravity.y = 3000;
        //player.body.velocity.y = +300;
    }
    /*else if (cursors.left.isDown)
    {
        player.body.velocity.x = -300;
    }*/
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = (300);
    }
    else {
      player.body.velocity.x = 0;
    }
  
    if(this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
      weapons[currentWeapon].fire(player);
    }
  
    if (player.body.velocity.x < 400) {
      player.body.velocity.x = 400;
    }
  
    playerDieCheck();
    

}

function playerDieCheck() {
  if (player.y < 0 || player.y > game.world.height) {
    if (player.alive) {
      playerDie();
      game.time.events.add(500, function() {
        console.log('end');
      })
    }
  }
}

function playerDie() {
  fireEmitter(player.x, player.y);
  player.kill();
}

function addMobileInputs() {
  
}
      
function render() {

    game.debug.cameraInfo(game.camera, 32, 32);
    game.debug.spriteCoords(player, 32, 300);
    game.debug.pointer(game.input.mousePointer);
    game.debug.pointer(game.input.pointer1);

}
