import Phaser from "phaser";

import pipoyaPng from "./assets/pipoya32x32.png";
import map0 from "./assets/map1.json";
import map1 from "./assets/room1.json";
import map2 from "./assets/room2.json";

import mainPage from "./assets/mainpage.jpg";

export default class menuScene extends Phaser.Scene {
  constructor() {
    super(menuScene);
  }

  preload() {
    this.load.spritesheet("pipoya", pipoyaPng, {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.tilemapTiledJSON("map0", map0);
    this.load.tilemapTiledJSON("map1", map1);
    this.load.tilemapTiledJSON("map2", map2);

    this.load.image("main", mainPage);

    // this.load.audio("explode", explode);
    // this.load.audio("shooter", shooter);
    // this.load.audio("ping", ping);

    //this.load.audio('bgMusic', bgMusic);
    //this.load.audio('moongate', moongateSnd);
  }

  create() {
    console.log("*** menuScene");
    this.scene.bringToTop();
    //this.scene.sendToBack('showInventory');

    // Add any sound and music here
    // ( 0 = mute to 1 is loudest )
    // this.music = this.sound.add('bgMusic', {
    //     loop: true
    // }).setVolume(0.2) // 30% volume
    // this.music.play()

    var rect = new Phaser.Geom.Rectangle(0, 576, 640, 64);
    var graphics = this.add.graphics({
      fillStyle: {
        color: 0x000000,
      },
    });
    graphics.fillRectShape(rect).setScrollFactor(0);

    // Add image and detect spacebar keypress
    this.add.image(0, 0, "main").setOrigin(0, 0);
    var spaceDown = this.input.keyboard.addKey("SPACE");
    this.add.text(90, 600, "Press spacebar to continue", {
      font: "30px Courier",
      fill: "#FFFFFF",
    });

    //////////////////////////////////////////////////////
    // Create all the animations here

    // Define objects for player and inventory
    this.player = {};
    this.inventory = {};
    this.player.x = 300;
    this.player.y = 300;
    this.inventory.horse = 4;
    this.inventory.chest = 2;
    this.inventory.iceball = 10;
    this.inventory.fireball = 10;
    this.inventory.random = this.randomNum;

    spaceDown.on(
      "down",
      function () {
        console.log("space - Jump to world scene");

        this.scene.start("world", {
          player: this.player,
          inventory: this.inventory,
        });
      },
      this
    );

    // mouse or touch
    this.input.on(
      "pointerdown",
      function (pointer) {
        console.log("mouse - Jump to world scene");

        this.scene.start("world", {
          player: this.player,
          inventory: this.inventory,
        });
      },
      this
    );
  } // end of create

  update(t, dt) {}
} // end of class scene
