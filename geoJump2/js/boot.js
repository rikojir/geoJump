var bootState = {

  preload: function() {
    /* Load the menu image */
    game.load.image('progressBar', 'assets/progressBar.png');
  },
  
  create: function() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.stage.backgroundColor = '#3498db';
    /* Scale the game to keep aspect ratio untouched and 
                always show the complete game */
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    /* Landscape allowed, portrait not */
    game.scale.forceOrientation(true, false);
    // If the device is not a desktop, so it's a mobile device
    if (!game.device.desktop) {
      // Add a blue color to the page, to hide the white borders we might have
      document.body.style.backgroundColor = '#3498db';
      // Set the min and max width/height of the game
      game.scale.minWidth = 400;
      game.scale.minHeight = 170;
      game.scale.maxWidth = 800;
      game.scale.maxHeight = 560;
      // Center the game on the screen
      game.scale.pageAlignHorizontally = true;
      game.scale.pageAlignVertically = true;
    }
    else {
      //Desktop device, so we can use higher max widths and heights
      document.body.style.backgroundColor = '#3498db';
      // Set the min and max width/height of the game
      game.scale.minWidth = 400;
      game.scale.minHeight = 170;
      game.scale.maxWidth = 800;
      game.scale.maxHeight = 600;
      // Center the game on the screen
      game.scale.pageAlignHorizontally = true;
      game.scale.pageAlignVertically = true;
    }
    
    game.state.start('load');
  }
}