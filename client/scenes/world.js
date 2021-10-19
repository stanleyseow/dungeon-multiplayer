import Player from "../objects/player";
import annaPng from "../scenes/assets/anna.png";
import peterPng from "../scenes/assets/peter32.png";
import robotPng from "../scenes/assets/robot32.png";

let player = {};

export default class world extends Phaser.Scene {
  constructor() {
    super("world");
  }

  // incoming data from scene below
  init(data) {
    //this.player = data.player
    this.inventory = data.inventory;

    // *** socketIO
    // Passed to player
    // scene
    // room
    // position { x: nnn, y: nn, direction : "down" }
    this.player = new Player(this, "world", {
      x: 650,
      y: 500,
      direction: "p-down",
    });
  }

  preload() {
    this.load.spritesheet("anna", annaPng, {
      frameWidth: 64,
      frameHeight: 64,
    });

    this.load.spritesheet("robot", robotPng, {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet("peter", peterPng, {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  create() {
    console.log("*** world");
    console.log("inventory: ", this.inventory);

    let map = this.make.tilemap({
      key: "map0",
    });

    let groundTiles = map.addTilesetImage("pipoya32x32", "pipoya");

    this.groundLayer = map.createLayer("groundLayer", groundTiles, 0, 0);
    this.itemLayer = map.createLayer("itemLayer", groundTiles, 0, 0);

    this.anims.create({
      key: "up-robot",
      frames: this.anims.generateFrameNumbers("robot", { start: 0, end: 7 }),
      frameRate: 15,
      repeat: -1,
    });

    this.anims.create({
      key: "down-robot",
      frames: this.anims.generateFrameNumbers("robot", { start: 19, end: 25 }),
      frameRate: 15,
      repeat: -1,
    });

    this.anims.create({
      key: "left-robot",
      frames: this.anims.generateFrameNumbers("robot", { start: 8, end: 16 }),
      frameRate: 15,
      repeat: -1,
    });

    this.anims.create({
      key: "right-robot",
      frames: this.anims.generateFrameNumbers("robot", { start: 26, end: 35 }),
      frameRate: 15,
      repeat: -1,
    });

    this.anims.create({
      key: "up-peter",
      frames: this.anims.generateFrameNumbers("peter", { start: 0, end: 7 }),
      frameRate: 15,
      repeat: -1,
    });

    this.anims.create({
      key: "down-peter",
      frames: this.anims.generateFrameNumbers("peter", { start: 19, end: 25 }),
      frameRate: 15,
      repeat: -1,
    });

    this.anims.create({
      key: "left-peter",
      frames: this.anims.generateFrameNumbers("peter", { start: 8, end: 16 }),
      frameRate: 15,
      repeat: -1,
    });

    this.anims.create({
      key: "right-peter",
      frames: this.anims.generateFrameNumbers("peter", { start: 26, end: 35 }),
      frameRate: 15,
      repeat: -1,
    });

    /////////////////////////////////////////////////////////////////
    // SocketIO codes //////////////////////////////////////////////

    this.player.create("robot");

    // debug for player
    window.player = this.player;

    this.cameras.main.on("camerafadeincomplete", () => {
      this.transition = false;

      // send stop when keyup
      this.input.keyboard.on("keyup", (event) => {
        if (event.keyCode >= 37 && event.keyCode <= 40) {
          this.player.stop();
        }
      });
    });

    let playerId = this.player.socket.id;
    console.log("player id: ", playerId);

    //let player = this.player.playersObj[playerId];
    console.log("this.player: ", this.player);

    this.anna = this.physics.add.sprite(400, 400, "anna");

    this.physics.add.collider(this.anna, player);

    /////////////////////////////////////////////////////////////////

    // door1
    this.itemLayer.setTileIndexCallback(360, this.room1, this);
    this.itemLayer.setTileIndexCallback(368, this.room1, this);

    // door2
    this.itemLayer.setTileIndexCallback(376, this.room2, this);
    this.itemLayer.setTileIndexCallback(384, this.room2, this);

    this.physics.add.collider(this.itemLayer, this.player);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    //this.cameras.main.startFollow(this.player);

    // mini map
    this.minimap = this.cameras
      .add(10, 10, 150, 150)
      .setZoom(0.5)
      .setName("mini");
    this.minimap.setBackgroundColor(0x000000);
    this.minimap.startFollow(player);
    this.minimap.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    // this.minimap.scrollX = 320;
    // this.minimap.scrollY = 320;

    console.log(
      "game canvas (w,h): ",
      this.sys.game.canvas.width,
      this.sys.game.canvas.height
    );
    console.log("InPixels (w,h): ", map.widthInPixels, map.heightInPixels);
  }

  update() {
    if (this.cursors.left.isDown) {
      this.player.left();
      //this.player.body.setVelocityX(-speed);
    } else if (this.cursors.right.isDown) {
      this.player.right();
      //this.player.body.setVelocityX(speed);
    } else if (this.cursors.up.isDown) {
      this.player.up();
      //this.player.body.setVelocityY(-speed);
    } else if (this.cursors.down.isDown) {
      this.player.down();
      //this.player.body.setVelocityY(speed);
    }
  } /////////////////// end of update //////////////////////////////////////

  room1(player, tile) {
    console.log("room1: ", tile);
    // this.scene.start("room1", {
    //   player: player,
    //   inventory: this.inventory,
    // });
  }

  room2(player, tile) {
    console.log("room2: ", tile);
    // this.scene.start("room2", {
    //   player: player,
    //   inventory: this.inventory,
    // });
  }
} //////////// end of class world ////////////////////////
