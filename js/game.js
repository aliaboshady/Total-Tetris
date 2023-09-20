/// <reference path="../phaser.d.ts" />

let game;
let config;

window.addEventListener('load', () => {
  config = {
    type: Phaser.AUTO,
    backgroundColor: '#cdcdcd',
    width: 540,
    height: 740,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    scene: [SceneMain]
  };
  
  game = new Phaser.Game(config)
});
