var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example');

game.global = {
  level: 1,
  player: null,
  cursors: null,
  group: null,
  enemies: null,
  emitter: [],

  /* Empty weapons array, name and currentWeapon index, we could implement multiple weapons */
  weapons: [],
  currentWeapon: 0,
  weaponName: null,

  Weapon : {},

  /* Tilemap and layer */
  map: null,
  layer: null,

  /* Checkpoint */
  checkpoint: 0,
  
  /* Buttons */
  playButton: null,
  muteButton: null,
  startLabel: null
}

/* Add all the states */
game.state.add('boot', bootState);
game.state.add('menu', menuState);
game.state.add('play', playState);
game.state.add('load', loadState);
game.state.add('levelSelection', levelSelectionState);
game.state.add('levelCompleted', levelCompletedState);

/* Start the boot state */
game.state.start('boot');



