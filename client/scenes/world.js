import Player from "../objects/player";
import annaPng from "../scenes/assets/anna.png";
import peterPng from "../scenes/assets/peter32.png";
import robotPng from "../scenes/assets/robot32.png";

export default class world extends Phaser.Scene {
  constructor() {
    super("world");
  }

  // incoming data from scene below
  init(data) {
    this.inventory = data.inventory;
    this.character = data.character;
    let avatarPos = "";
    avatarPos = "down-" + this.character;
    this.player = new Player(this, "world", {
      x: 650,
      y: 500,
      direction: avatarPos,
    });
  }

  preload() {
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

    /////////////////////////////////////////////////////////////////
    // SocketIO codes //////////////////////////////////////////////

    this.player.create(this.character, this.itemLayer);

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

    /////////////////////////////////////////////////////////////////

    this.cursors = this.input.keyboard.createCursorKeys();

    // console.log(
    //   "game canvas (w,h): ",
    //   this.sys.game.canvas.width,
    //   this.sys.game.canvas.height
    // );
    // console.log("InPixels (w,h): ", map.widthInPixels, map.heightInPixels);
  }

  update() {
    let playerId = this.player.socket.id;
    //console.log("player id: ", playerId);
    this.currentPlayer = this.player.currentPlayer;
    //console.log("this.currentPlayer: ", this.currentPlayer);

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
