import Player from "../objects/player";
import io from "socket.io-client";
import {
  NEW_PLAYER,
  ALL_PLAYERS,
  CHAT,
  KEY_PRESS,
  MOVE,
  STOP,
  REMOVE,
} from "../../shared/constants/playerAction";

export default class room1 extends Phaser.Scene {
  constructor() {
    super("room1");
  }

  init(data) {
    this.inventory = data.inventory;
    this.character = data.character;
    let avatarPos = "";
    avatarPos = "down-" + this.character;
    this.player = new Player(this, "room1", {
      x: 320,
      y: 526,
      direction: avatarPos,
    });
  }

  preload() {}

  create() {
    console.log("*** room1");

    let map = this.make.tilemap({
      key: "map1",
    });

    let groundTiles = map.addTilesetImage("pipoya32x32", "pipoya");

    this.groundLayer = map.createLayer("groundLayer", groundTiles, 0, 0);
    this.itemLayer = map.createLayer("itemLayer", groundTiles, 0, 0);

    // Create player in room
    this.player.create(this.character, this.itemLayer);

    // debug for player
    //window.player = this.player;

    this.cameras.main.on("camerafadeincomplete", () => {
      this.transition = false;

      // send stop when keyup
      this.input.keyboard.on("keyup", (event) => {
        if (event.keyCode >= 37 && event.keyCode <= 40) {
          this.player.stop();
        }
      });
    });

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    this.currentPlayer = this.player.currentPlayer;
    window.currentPlayer = this.currentPlayer;

    if (
      this.currentPlayer.x > 300 &&
      this.currentPlayer.x < 350 &&
      this.currentPlayer.y > 550 &&
      this.currentPlayer.y < 610
    ) {
      this.world(this.currentPlayer);
    }

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
  }

  world(player) {
    console.log("Sending REMOVE: ", this.player.socket.id, this.player.room);
    this.player.socket.emit(REMOVE, this.player.socket.id, this.player.room);

    console.log("Jumping to world: ", player);
    this.player.x = 505;
    this.player.y = 895;
    this.scene.start("world", {
      player: this.player,
      inventory: this.inventory,
      character: this.character,
    });
  }
}
