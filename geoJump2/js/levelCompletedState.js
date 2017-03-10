var levelCompletedState = {
  preload: function () {
    
  },
  
  create: function () {
    this.winLabel = game.add.text(game.camera.width/2, -50, 'level completed!', {font: '50px Geo', fill: '#ffffff'});
    this.winLabel.anchor.setTo(0.5, 0.5);
    
    // Tween for falling down
    var fallDownTween = game.add.tween(this.winLabel).to({x: game.camera.width/2, y: game.camera.height/2}, 750).easing(Phaser.Easing.Bounce.Out).start();
    // Fire emitter in 750 ms
    //tween.onComplete.add(this.fireEmitter, this);
    //fallDownTween.onComplete.add(function() { game.add.tween(winLabel).to( { angle: 359 }, 1000, Phaser.Easing.Linear.None, true)}, this);
    game.time.events.add(300, this.fireEmitter, this);
    // Tween for rotating
    game.add.tween(this.winLabel).to({angle: -3}, 500).to({angle: 0}, 500).to({angle: 3}, 500).to({angle: 0}, 500).loop().start();
    
    //Add three emitters at a little above center and left and right
    this.emitterUp = game.add.emitter(game.camera.width/2, game.camera.height/2 + 30, 75);
    this.emitterLeft = game.add.emitter(game.camera.width/2 - 50, game.camera.height/2 - 15, 75);
    this.emitterRight = game.add.emitter(game.camera.width/2 + 50, game.camera.height/2 - 20, 75);
    //Use the pixel.png image as a particle
    this.emitterUp.makeParticles('pixel');
    this.emitterLeft.makeParticles('pixel');
    this.emitterRight.makeParticles('pixel');
    //When firing, choose random x/y speed between -150 and 150
    this.emitterUp.setYSpeed(-150, 150);
    this.emitterUp.setXSpeed(-150, 150);
    this.emitterRight.setYSpeed(-150, 150);
    this.emitterRight.setXSpeed(-150, 150);
    this.emitterLeft.setYSpeed(-150, 150);
    this.emitterLeft.setXSpeed(-150, 150);
    //No gravity for pixels, otherwise the pixels will fall down
    this.emitterUp.gravity = 0;
    this.emitterLeft.gravity = 0;
    this.emitterRight.gravity = 0;
    
    game.add.tween(this.winLabel).to( { angle: 359 }, 1000, Phaser.Easing.Linear.None, true);
    // Wait 3 seconds and return back to level selection
    game.time.events.add(1500, this.backToLevelSelection, this);
    
  },
  
  backToLevelSelection: function() {
    this.scaleTween = game.add.tween(this.winLabel.scale).to({ x: 0, y: 0}, 750, Phaser.Easing.Back.Out, true, 1000);
    delete(emitterUp);
    delete(emitterLeft);
    delete(emitterRight);
    this.scaleTween.onComplete.add(function() {
      game.state.start('levelSelection');
    }, this);
  },
  
  fireEmitter: function() {
    this.emitterUp.start(true, 900, null, 90);
    this.emitterRight.start(true, 1000, null, 90);
    this.emitterLeft.start(true, 1100, null, 90);
  }
}