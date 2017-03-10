var playState = {

  preload: function() {
    
  },
  
  create: function() {
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

      game.global.Weapon.SingleBullet = function (game) {
        Phaser.Group.call(this, game, game.world, 'Single Bullet', false, true, Phaser.Physics.ARCADE);
        this.nextFire = 0;
        this.bulletSpeed = 600;
        this.fireRate = 100;
        for (var i = 0; i < 64; i++) {
          this.add(new Bullet(game, 'pixel'), true);
        }
        console.log("Added bullets to weapon");
        return this;
      };

      game.global.Weapon.SingleBullet.prototype = Object.create(Phaser.Group.prototype);
      game.global.Weapon.SingleBullet.prototype.constructor = game.global.Weapon.SingleBullet;

      game.global.Weapon.SingleBullet.prototype.fire = function (source) {
        if (game.time.time < this.nextFire) {
          return;
        }
        var x = source.x + 10;
        var y = source.y + 10;
        console.log(this);
        console.log(this.getFirstExists(false));
        this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 0);
        this.nextFire = this.game.time.time + this.fireRate;
      };

      // !!! IMPORTANT !!! Clear the global weapons array before adding a new SingleBullet-Weapon to it, otherwise we get an index error because the old weapons has no more bullets when restarting the playState
      game.global.weapons = [];
      game.global.weapons.push(new game.global.Weapon.SingleBullet(this.game));
    ////////////////////////////////////////////////////
    //  Core game Loop: preload, create, update       //
    ////////////////////////////////////////////////////


    

    game.global.player = game.add.sprite(10, game.world.centerY, 'player');
    game.physics.arcade.enable(game.global.player);

    this.createWorld();

    this.createEnemies();

    /* If emitters haven't been set up, set them up */
    /* Prevents this state to create 5 new emitters every time you start a level */
    if (game.global.emitter.length === 0) {
          this.setupEmitters();
    }

    game.global.player.body.gravity.y = 3000;
    //player.body.collideWorldBounds = true;
    game.global.player.body.velocity.x = 0;
    
    game.time.events.repeat(Phaser.Timer.SECOND * 1.5, 10000, this.changeEnemyDirection, this);

    cursors = game.input.keyboard.createCursorKeys();

    game.camera.follow(game.global.player);

  },

  createWorld: function() {
      // Create the tilemap
      game.global.map = game.add.tilemap('map1');

      // Add the tileset to the map
      game.global.map.addTilesetImage('tileset');

      // Create the layer, by specifying the name of the Tiled layer
      game.global.layer = game.global.map.createLayer('Tile Layer 1');
      
      //  Here we create our coins group
      game.global.enemyCollisionGroup = game.add.group();
    
      // Set the world size to match the size of the layer
      game.global.layer.resizeWorld();

      //Enable collisions for the first element of our tileset (the blue wall)
      /*game.global.map.setCollision(6);
      game.global.map.setCollision(24);
      game.global.map.setCollision(4);*/
      //map.setTileIndexCallback(4, port, this);
      
      game.global.map.setCollisionBetween(0, 156);
      
      /*var portLocations360 = [];
      portLocations360.push(
        [283, 15],
        [460, 10],
        [492, 10],
        [698, 10]
      );
      for (var i = 0; i < portLocations360.length; i++) {
        game.global.map.setTileLocationCallback(portLocations360[i][0], portLocations360[i][1], 1, 1, function() {
          this.port(game.global.player.x + 360, game.global.player.y) }, this);
      }


      var portLocations220 = [];
      portLocations220.push(
        [541, 7],
        [541, 15]
      );
      for (var j = 0; j < portLocations220.length; j++) {
        game.global.map.setTileLocationCallback(portLocations220[j][0], portLocations220[j][1], 1, 1, function() {
          this.port(game.global.player.x + 220, game.global.player.y) }, this);
      }*/
  },
  
  moveEnemies: function() {
    for (var i = 0; i < game.global.enemies.children.length; i++) {
      game.global.enemies.children[i].body.velocity.x = -100;
    }
  },
  
    
  changeEnemyDirection: function() {
    console.log("check");
        for (var i = 0; i < game.global.enemies.children.length; i++) {
          game.global.enemies.children[i].body.velocity.x = -game.global.enemies.children[i].body.velocity.x;
        }
  },

  createEnemies: function() {
    
      var enemyLocations = [];
      enemyLocations.push(
        [145*20, 4*20],
        [145*20, 5*20],
        [145*20, 11*20],
        [145*20, 12*20],
        [376*20, 8*20],
        [376*20, 9*20],
        [402*20, 7*20],
        [403*20, 7*20],
        [404*20, 7*20],
        [402*20, 8*20],
        [403*20, 8*20],
        [404*20, 8*20],
        [402*20, 9*20],
        [403*20, 9*20],
        [404*20, 9*20],
        [432*20, 7*20],
        [433*20, 7*20],
        [434*20, 7*20],
        [432*20, 8*20],
        [433*20, 8*20],
        [434*20, 8*20],
        [432*20, 9*20],
        [433*20, 9*20],
        [434*20, 9*20]
      );
    game.global.enemies = game.add.physicsGroup();

    for (var i = 0; i < enemyLocations.length; i++) {
      var c = game.global.enemies.create(enemyLocations[i][0], enemyLocations[i][1], 'enemy');
      //c.body.immovable = true;
    }
    
    this.moveEnemies();
  },
  
  setupEmitters: function() {

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

      game.global.emitter.push(emittr);
    }
    console.log(game.global.emitter);
  },

  fireEmitter: function(xCoordinate, yCoordinate) {
      for (var i = 0; i < game.global.emitter.length; i++) {
      if (game.global.emitter[i].x == 0 && game.global.emitter[i].y == 0) {
        var emitterIndex = i;
        break;
      }
    }
    console.log("Emitter fired: " + emitterIndex);
    // Set the position of the emitter to the enemies position
    game.global.emitter[i].x = xCoordinate;
    game.global.emitter[i].y = yCoordinate;
    // true = all particles at once, 300ms lifespan for each particle, frequency null because all particles explode at once, 15 particles will explode
    game.global.emitter[i].start(true, 1000, null, 10);

    /* After 200ms reset the position of the emittr, otherwise it will be immediately reset to 0/0 and be selected for the next collision call, but since the animation will still be running then, nothing happens, so with 200ms waiting the next emitter will be chosen, and a second (third, fourth and fifth) animation can be fired simultaneously */
    game.time.events.add(200, function() {
      game.global.emitter[i].x = 0;
      game.global.emitter[i].y = 0;
    }, this);

  },

  port: function(x, y) {
      console.log("Porting");
      //player.x = player.x + 360;
      game.add.tween(game.global.player).to( { x: x, y: y }, 100, null, true);
  },

  processHandler: function(bullet, enemies) {

      //return true;

  },

  collisionHandler: function(bullet, pixel) {
      if (pixel.frame == 0)
      {
        this.fireEmitter(pixel.x, pixel.y);
        pixel.kill();
        bullet.kill();
      }
  },

  handleTouchInput: function(pointer) {
    //pointer param is the pointer that fired the event
    if (pointer.x < game.camera.width / 2) {
      // Change gravity
      game.global.player.body.gravity.y = -game.global.player.body.gravity.y;
      console.log("Gravity changed");
    }
    else {
      // Shoot
        game.global.weapons[game.global.currentWeapon].fire(game.global.player);
    }
  },

  update: function() {

      /* Tell Phaser that the player and the walls should collide */
      game.physics.arcade.collide(game.global.player, game.global.layer);
      game.physics.arcade.collide(game.global.enemies, game.global.layer);
      game.physics.arcade.overlap(game.global.player, game.global.enemies, this.playerDie, null, this);
      //game.physics.arcade.collide(game.global.enemies, game.global.enemyCollisionGroup, this.moveAliveEnemy, null, this);

      /* Collision between the weapons[0] group ( = the bullets of the SingleWeapon) and the enemies group */
      game.physics.arcade.collide(game.global.weapons[0], game.global.enemies, this.collisionHandler, this.processHandler, this);

      /* Control */
      game.input.onDown.add(this.handleTouchInput, this);



      if (cursors.up.isDown)
      {
        game.global.player.body.gravity.y = -3000;
        //player.body.velocity.y = -300;
      }
      else if (cursors.down.isDown)
      {
        game.global.player.body.gravity.y = 3000;
        //player.body.velocity.y = +300;
      }
      else if (cursors.left.isDown)
      {
        game.global.player.body.velocity.x = 0;
      }
      else if (cursors.right.isDown)
      {
        game.global.player.body.velocity.x = (300);
      }
      else {
        game.global.player.body.velocity.x = 0;
      }

      if(this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
        game.global.weapons[game.global.currentWeapon].fire(game.global.player);
      }

      if (game.global.player.body.velocity.x < 400) {
        game.global.player.body.velocity.x = 400;
      }

      if (game.global.checkpoint === 0 && game.global.player.x > game.world.width/2) {
        game.global.checkpoint = game.world.width/2;
      }

      this.playerDieCheck();
    
      this.levelCompletedCheck();

  },

  playerDieCheck: function() {
    if (game.global.player.y < 0 || game.global.player.y > game.world.height) {
      if (game.global.player.alive) {
        this.playerDie();
      }
    }
  },

  playerDie: function() {
    game.global.player.kill();
    this.fireEmitter(game.global.player.x, game.global.player.y);
    game.time.events.add(500, this.startMenu, this);
    
  },
  
  levelCompletedCheck: function() {
    if (game.global.player.x > game.world.width-1) {
      game.time.events.add(500, function() {
        game.state.start('levelCompleted');
      });
    }
  },
  
  startMenu: function() {
    game.state.start('menu');
  },

  render: function() {

      game.debug.cameraInfo(game.camera, 32, 32);
      game.debug.spriteCoords(game.global.player, 32, 300);
      game.debug.pointer(game.input.mousePointer);
      game.debug.pointer(game.input.pointer1);

  },
}