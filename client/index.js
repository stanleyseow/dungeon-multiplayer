import Phaser from "phaser";
import menuScene from "./scenes/menuScene";
import world from "./scenes/world";
import room1 from "./scenes/room1";
import room2 from "./scenes/room2";

var config = {
  type: Phaser.AUTO,
  // width: 32 * 20,
  // height: 32 * 20,
  width: 1600,
  height: 800,
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
    },
  },
  
  scale: {
    zoom: 0.9,
    // mode: Phaser.Scale.FIT,
    // autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  backgroundColor: "#000000",
  pixelArt: true,
  //parent: 'phaser-example',
  scene: [menuScene, world, room1, room2],
};

const game = new Phaser.Game(config);
