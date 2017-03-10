var levelSelectionState = {
  preload: function () {
    
  },
  
  create: function () {
    /* Add level buttons */
    this.level1 = game.add.button(game.camera.width/2 - 150, 50, 'level1', function() {this.startLevel(1)}, this);
    this.level1.anchor.setTo(0.5, 0.5);
    this.level2 = game.add.button(game.camera.width/2 - 75, 50, 'level2', function() {this.startLevel(2)}, this);
    this.level2.anchor.setTo(0.5, 0.5);
    this.level3 = game.add.button(game.camera.width/2, 50, 'level3', function() {this.startLevel(3)}, this);
    this.level3.anchor.setTo(0.5, 0.5);
    this.level4 = game.add.button(game.camera.width/2 + 75, 50, 'level4', function() {this.startLevel(4)}, this);
    this.level4.anchor.setTo(0.5, 0.5);
    this.level5 = game.add.button(game.camera.width/2 + 150, 50, 'level5', function() {this.startLevel(5)}, this);
    this.level5.anchor.setTo(0.5, 0.5);
  },
  
  startLevel: function(arg) {
    game.global.level = arg;
    console.log(game.global.level);
    game.state.start('play');
  }
}