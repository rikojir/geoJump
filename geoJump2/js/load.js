var loadState = {

  preload: function() {
    /* Add a loading label on the screen */
    var loadingLabel = game.add.text(game.world.centerX, 150, 'loading ...', {font: '30px Arial', fill: '#ffffff'});
    loadingLabel.anchor.setTo(0.5, 0.5);
    
    /* Display the progress bar */
    var progressBar = game.add.sprite(game.world.centerX, 200, 'progressBar');
    progressBar.anchor.setTo(0.5, 0.5);
    game.load.setPreloadSprite(progressBar);
    
    game.load.image('background','assets/debug-grid-1920x1920.png');
    game.load.image('playButton', 'assets/playButton.png');
    game.load.spritesheet('muteButton', 'assets/muteButton.png', 28, 22);
    game.load.image('player','assets/player.png');
    game.load.image('pixel', 'assets/pixel.png');
    game.load.image('enemy', 'assets/enemy.png');
    //game.load.image('tileset', 'assets/5x5x20x20FarbPalette.png');
    game.load.image('tileset', 'assets/tiles_spritesheet.png');
    game.load.tilemap('map1', 'assets/geoJump4.json', null, Phaser.Tilemap.TILED_JSON);
    
    game.load.image('level1', 'assets/level1.png');
    game.load.image('level2', 'assets/level2.png');
    game.load.image('level3', 'assets/level3.png');
    game.load.image('level4', 'assets/level4.png');
    game.load.image('level5', 'assets/level5.png');
  },
  
  create: function() {
    /* Go to the menu state */
    game.state.start('menu');
  }
}