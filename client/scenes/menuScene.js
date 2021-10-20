import Phaser from "phaser";

import pipoyaPng from "./assets/pipoya32x32.png";
import map0 from "./assets/map1.json";
import map1 from "./assets/room1.json";
import map2 from "./assets/room2.json";

//======== character spritesheet's import ========
import robotPng from "../scenes/assets/robot32.png";
import peterPng from "../scenes/assets/peter32.png";

import mainPage from "./assets/mainpage.jpg";

export default class menuScene extends Phaser.Scene {
  constructor() {
    super(menuScene);
  }

  preload() {
    //======== Spritesheet's preload ========
    //========== map's spritesheet ==========
    this.load.spritesheet("pipoya", pipoyaPng, {
      frameWidth: 32,
      frameHeight: 32
    });
    //======= character's spritesheet =======
    this.load.spritesheet("robot", robotPng, {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet("peter", peterPng, {
      frameWidth: 32,
      frameHeight: 32,
    });
    //====== end spritesheet's preload ======

    this.load.tilemapTiledJSON("map0", map0);
    this.load.tilemapTiledJSON("map1", map1);
    this.load.tilemapTiledJSON("map2", map2);

    this.load.image("main", mainPage);

    //=========== audio preloads ===========
    // this.load.audio("explode", explode);
    // this.load.audio("shooter", shooter);
    // this.load.audio("ping", ping);

    // this.load.audio('bgMusic', bgMusic);
    // this.load.audio('moongate', moongateSnd);

  }//end preload

  create() {
    console.log("*** menuScene");
    this.scene.bringToTop();
    //this.scene.sendToBack('showInventory');

    // ==== Add any sound and music here ====
    // ==== ( 0 = mute to 1 is loudest ) ====
    // this.music = this.sound.add("bgMusic", {loop: true}).setVolume(0.2); // 30% volume
    // this.music.play()

    var rect = new Phaser.Geom.Rectangle(0, 576, 640, 64);
    var graphics = this.add.graphics({
      fillStyle: {
        color: 0x000000
      }
    });
    graphics.fillRectShape(rect).setScrollFactor(0);

    // Add image and detect spacebar keypress
    this.add.image(0, 0, "main").setOrigin(0, 0);
    var spaceDown = this.input.keyboard.addKey("SPACE");

    //================== Main text ==================
    // this.add.text(90, 600, "Press spacebar to continue", {
    //   font: "30px Courier",
    //   fill: "#FFFFFF",
    // });
    this.add.text(130, 550, "Select your character", {
      font: "30px Courier",
      fill: "#FFFFFF"
    });
    //================ end main text ================

    //======== Create all the animations here ========
    this.anims.create({
      key: "down-robot",
      frames: this.anims.generateFrameNumbers("robot", { start: 18, end: 26 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: "down-peter",
      frames: this.anims.generateFrameNumbers("peter", { start: 19, end: 25 }),
      frameRate: 10,
      repeat: -1,
    });
    //================ end animations ================

    this.character_1 = this.physics.add.sprite(220, 300, "robot").play("down-robot").setScale(5).setInteractive();
    this.character_2 = this.physics.add.sprite(420, 300, "peter").play("down-peter").setScale(5).setInteractive();
    this.character_1.on('pointerdown', function (pointer){
      console.log("selected robot character");
      this.character = "robot";
      this.scene.start("world", {player: this.player, inventory: this.inventory, character: this.character});
    },this);
    this.character_2.on('pointerdown', function (pointer){
      console.log("selected peter character");
      this.character = "peter";
      this.scene.start("world", {player: this.player, inventory: this.inventory, character: this.character});
    },this);

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

    //========== Space pressed to next scene ==========
    // spaceDown.on("down",function (){
    //   console.log("space - Jump to world scene");
    //   this.scene.start("world", {player: this.player, inventory: this.inventory});
    // },this);
    //========== Mouse pressed to next scene ==========
    // this.input.on("pointerdown", function (pointer){
    //   console.log("mouse - Jump to world scene");
    //   this.scene.start("world", {player: this.player, inventory: this.inventory});
    // },this);

    // console.log(this.input.activePointer.x, this.input.activePointer.y)

  } // end of create

  update(t, dt) {}
} // end of class scene