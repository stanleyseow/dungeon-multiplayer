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

import cityMap from "./assets/maps/metacity.json";
// import cityMapp from './assets/maps/newMapCity.json';

import tileGarden from "./assets/spritePNG/victorian-garden.png";
import tileAccessories from "./assets/spritePNG/victorian-accessories.png";
import tileMansion from "./assets/spritePNG/victorian-mansion.png";
import tileStreets from "./assets/spritePNG/victorian-streets.png";
import tileTenement from "./assets/spritePNG/victorian-tenement.png";
import tileWindowsDoors from "./assets/spritePNG/victorian-windows-doors.png";
import tileRoof from "./assets/spritePNG/roofs.png";

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
      x: data.player.x,
      y: data.player.y,
      direction: avatarPos,
    });
  }

  preload() {
    this.load.tilemapTiledJSON("cityMapp", cityMap);

    this.load.image("tilesGarden", tileGarden);
    this.load.image("tilesAccessoriess", tileAccessories);
    this.load.image("tilesWindows", tileWindowsDoors);
    this.load.image("tilesTenements", tileTenement);
    this.load.image("tilesStreetss", tileStreets);
    this.load.image("tilesMansions", tileMansion);
    this.load.image("tilesRoofss", tileRoof);
  }

  create() {
    console.log("*** world");
    //console.log("inventory: ", this.inventory);

    // let map = this.make.tilemap({
    //   key: "map0",
    // });

    let map = this.make.tilemap({
      key: "cityMapp",
    });

    let accessoriesLayer = map.addTilesetImage(
      "accessories",
      "tilesAccessoriess"
    );
    let gardenLayer = map.addTilesetImage("garden", "tilesGarden");
    let roofLayer = map.addTilesetImage("roofs", "tilesRoofss");
    let tenementLayer = map.addTilesetImage("tenement", "tilesTenements");
    let windowsLayer = map.addTilesetImage("windows", "tilesWindows");
    let mansionLayer = map.addTilesetImage("mansion", "tilesMansions");

    let groundTiles = map.addTilesetImage("pipoya32x32", "pipoya");

    let groundL = map.createLayer("ground", [
      groundTiles,
      accessoriesLayer,
      gardenLayer,
      roofLayer,
      tenementLayer,
      windowsLayer,
      mansionLayer,
    ]);
    let layer1L = map.createLayer("layer1", [
      groundTiles,
      accessoriesLayer,
      gardenLayer,
      roofLayer,
      tenementLayer,
      windowsLayer,
      mansionLayer,
    ]);
    let firstFloorL = map.createLayer("firstFloor", [
      groundTiles,
      accessoriesLayer,
      gardenLayer,
      roofLayer,
      tenementLayer,
      windowsLayer,
      mansionLayer,
    ]);
    let roofL = map.createLayer("roof", [
      groundTiles,
      accessoriesLayer,
      gardenLayer,
      roofLayer,
      tenementLayer,
      windowsLayer,
      mansionLayer,
    ]);
    let roof2L = map.createLayer("roof2", [
      groundTiles,
      accessoriesLayer,
      gardenLayer,
      roofLayer,
      tenementLayer,
      windowsLayer,
      mansionLayer,
    ]);
    let roofwindowsL = map.createLayer("roofwindows", [
      groundTiles,
      accessoriesLayer,
      gardenLayer,
      roofLayer,
      tenementLayer,
      windowsLayer,
      mansionLayer,
    ]);

    // this.groundLayer = map.createLayer("groundLayer", groundTiles, 0, 0);
    // this.itemLayer = map.createLayer("itemLayer", groundTiles, 0, 0);

    /////////////////////////////////////////////////////////////////
    // SocketIO codes //////////////////////////////////////////////

    this.player.create(this.character, mansionLayer);

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

    if (
      this.currentPlayer.x > 476 &&
      this.currentPlayer.x < 520 &&
      this.currentPlayer.y > 820 &&
      this.currentPlayer.y < 880
    ) {
      this.room1(this.currentPlayer);
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
  } /////////////////// end of update //////////////////////////////////////

  room1(player) {
    console.log("Sending REMOVE: ", this.player.socket.id, this.player.room);

    this.player.socket.emit(REMOVE, this.player.socket.id, this.player.room);

    // player.destroy();
    // delete player;

    console.log("Jumping to room1: ", player);
    this.scene.start("room1", {
      player: this.player,
      inventory: this.inventory,
      character: this.character,
    });
  }
} //////////// end of class world ////////////////////////
