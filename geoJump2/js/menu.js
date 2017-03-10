var menuState = {
    
    create: function () {
        // Add a background image game.add.image(0, 0, 'background');
        // Display the name of the game
        this.nameLabel = game.add.text(game.camera.width / 2, -50, 'Super Coin Box', {
            font: '50px Geo'
            , fill: '#ffffff'
        });
        this.nameLabel.anchor.setTo(0.5, 0.5);
      
        //Tween for nameLabel
        game.add.tween(this.nameLabel).to({y: 80}, 1000).easing(Phaser.Easing.Bounce.Out).start();
      
        //Add best score with HTML5 local storage
        //If there is no key-/value-pair by now, add it
        if (!localStorage.getItem('bestScore')) {
          localStorage.setItem('bestScore', 0);
        }
      
        //Check, if the best score has been beaten and update the localStorage accordingly
        if (game.global.score > localStorage.getItem('bestScore')) {
          localStorage.setItem('bestScore', game.global.score);
        }
    
        // Show the score at the center of the screen
        var scoreLabel = game.add.text(game.camera.width / 2, game.camera.height / 2, 'score: ' + game.global.score + '\n' + 'best score: ' + localStorage.getItem('bestScore'), {font: '25px Geo', fill: '#ffffff'});
        scoreLabel.anchor.setTo(0.5, 0.5);
      
        // Create mute button
        this.muteButton = game.add.button(20, 20, 'muteButton', this.toggleSound, this);
        // Mouse icon turns into a hand cursor, when moved over the button
        this.muteButton.input.useHandCursor = true;
      
        // Create start button
        this.playButton = game.add.button(game.camera.width / 2, game.camera.height-game.camera.height/3, 'playButton', this.levelSelection, this);
        this.playButton.anchor.setTo(0.5, 0.5);
      
      
        // Store the relevant text based on the device used
        if (game.device.desktop) {
          var text = 'press up the arrow key or play button to start';
        }
        else {
          var text = 'press the play button to start';
          // Enable touch input
          //game.input.onDown.addOnce(this.start, this);
        }

        // Explain how to start the game
        var startLabel = game.add.text(game.camera.width / 2, game.camera.height - game.camera.height/5, text, {font: '25px Geo', fill: '#ffffff'});
        startLabel.anchor.setTo(0.5, 0.5);
      
        //Tween for startLabel
        game.add.tween(startLabel).to({angle: -2}, 500).to({angle: 0}, 500).to({angle: 2}, 500).to({angle: 0}, 500).loop().start();
      
        // Create a new Phaser keyboard variable: the up arrow key
        var upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
      
        // When the 'upKey' is pressed, it will call the 'start' function once
        upKey.onDown.addOnce(this.levelSelection, this);
    },
  
    toggleSound: function() {
      // If we die when the game is muted and the default frame 0 is shown, we change it to achieve consistency
      if (game.sound.mute) {
        this.muteButton.frame = 1;
      }
      game.sound.mute = ! game.sound.mute;
      this.muteButton.frame = game.sound.mute ? 1 : 0;
    },
    
    levelSelection: function () {
        //Start the actual game 
        game.state.start('levelSelection');
    }
};