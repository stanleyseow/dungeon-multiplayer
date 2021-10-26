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

let SPEED = 200;
let FADE_DURATION = 1000;
let playerKey;
let leftKey;
let rightKey;
let upKey;
let downKey;

//class Player extends Phaser.GameObjects.Sprite {
export default class Player {
  constructor(scene, room, position) {
    //super(scene);

    this.scene = scene;
    this.room = room;
    this.position = position;
    this.socket = io();
    this.playersObj = {};
    this.currentPlayer = {};

    console.log("scene: ", this.scene);
    console.log("room: ", this.room);
    console.log("position: ", this.position);
  }

  create(key, itemLayer) {
    playerKey = key;
    leftKey = "left-" + key;
    rightKey = "right-" + key;
    upKey = "up-" + key;
    downKey = "down-" + key;
    this.itemLayer = itemLayer;

    // Send avatar after position
    this.socket.emit(NEW_PLAYER, this.room, this.position, playerKey);
    console.log("*** emit player.create NEW_PLAYER");

    this.socket.on(NEW_PLAYER, (data) => {
      console.log("*** recv NEW_PLAYER: ", data);
      this.addPlayer(data.id, data.x, data.y, data.direction, data.avatar);
    });

    this.socket.on(ALL_PLAYERS, (data) => {
      console.log("*** recv ALL_PLAYER: ", data);
      this.scene.cameras.main.fadeFrom(FADE_DURATION);
      this.scene.scene.setVisible(true, this.room);

      for (let i = 0; i < data.length; i++) {
        this.addPlayer(
          data[i].id,
          data[i].x,
          data[i].y,
          data[i].direction,
          data[i].avatar
        );
      }

      this.currentPlayer = this.playersObj[this.socket.id];
      console.log("this.currentPlayer: ", this.currentPlayer);

      // Camera follow player
      this.scene.cameras.main.startFollow(
        this.playersObj[this.socket.id],
        true
      );

      // mini map
      this.minimap = this.scene.cameras
        .add(10, 10, 150, 150)
        .setZoom(0.3)
        .setName("mini");
      this.minimap.setBackgroundColor(0x000000);
      this.minimap.startFollow(this.playersObj[this.socket.id]);
      //   this.minimap.scrollX = 320;
      //   this.minimap.scrollY = 320;

      //this.scene.physics.add.collider(this.itemLayer, this.currentPlayer);

      // not working
      //this.playersObj[this.socket.id].setCollideWorldBounds(true);

      this.socket.on(MOVE, (data) => {
        //console.log("*** recv MOVE: ", data);
        this.playersObj[data.id].x = data.x;
        this.playersObj[data.id].y = data.y;
        this.playersObj[data.id].anims.play(data.direction, true);
      });

      this.socket.on(STOP, (data) => {
        //console.log("*** recv STOP: ", data);
        this.playersObj[data.id].x = data.x;
        this.playersObj[data.id].y = data.y;
        this.playersObj[data.id].anims.stop();
      });

      this.socket.on(REMOVE, (id, room) => {
        console.log("*** recv REMOVE: ", id);
        // Destroy sprite
        // Delete from array list
        this.playersObj[id].destroy();
        delete this.playersObj[id];

        console.log("*** After DELETE: ", this.playersObj);
      });

      // Implement chat later
      //this.registerChat();
    });
  }

  addPlayer(id, x, y, direction, avatar) {
    console.log("*** addPlayer: ", id, x, y, direction, avatar);
    // Change here to get different avatar

    let downKeyAvatar = "";
    downKeyAvatar = "down-" + avatar;
    this.playersObj[id] = this.scene.physics.add
      .sprite(x, y, playerKey)
      .setScale(2);
    this.playersObj[id].body.setSize(20, 26);
    this.playersObj[id].anims.play(downKeyAvatar);
    this.playersObj[id].anims.stop();

    console.log("*** After addPlayer: ", this.playersObj);
  }

  left() {
    this.playersObj[this.socket.id].body.velocity.x = -SPEED;
    this.playersObj[this.socket.id].anims.play(leftKey, true);
    this.socket.emit(KEY_PRESS, leftKey, {
      x: this.playersObj[this.socket.id].x,
      y: this.playersObj[this.socket.id].y,
    });
  }

  right() {
    this.playersObj[this.socket.id].body.velocity.x = SPEED;
    this.playersObj[this.socket.id].anims.play(rightKey, true);
    this.socket.emit(KEY_PRESS, rightKey, {
      x: this.playersObj[this.socket.id].x,
      y: this.playersObj[this.socket.id].y,
    });
  }

  up() {
    this.playersObj[this.socket.id].body.velocity.y = -SPEED;
    this.playersObj[this.socket.id].anims.play(upKey, true);
    this.socket.emit(KEY_PRESS, upKey, {
      x: this.playersObj[this.socket.id].x,
      y: this.playersObj[this.socket.id].y,
    });
  }

  down() {
    this.playersObj[this.socket.id].body.velocity.y = SPEED;
    this.playersObj[this.socket.id].anims.play(downKey, true);
    this.socket.emit(KEY_PRESS, downKey, {
      x: this.playersObj[this.socket.id].x,
      y: this.playersObj[this.socket.id].y,
    });
  }

  stop() {
    this.playersObj[this.socket.id].body.velocity.x = 0;
    this.playersObj[this.socket.id].body.velocity.y = 0;
    this.playersObj[this.socket.id].anims.stop();
    this.socket.emit(STOP, {
      x: this.playersObj[this.socket.id].x,
      y: this.playersObj[this.socket.id].y,
    });
  }

  room1(player, tile) {
    console.log("room1: ", player, tile);
    // this.scene.start("room1", {
    //   player: player,
    //   inventory: this.inventory,
    // });
  }

  room2(player, tile) {
    console.log("room2: ", player, tile);
    // this.scene.start("room2", {
    //   player: player,
    //   inventory: this.inventory,
    // });
  }

  room3(player, tile) {
    console.log("room3: ", player, tile);
    // this.scene.start("room1", {
    //   player: player,
    //   inventory: this.inventory,
    // });
  }

  room4(player, tile) {
    console.log("room4: ", player, tile);
    // this.scene.start("room1", {
    //   player: player,
    //   inventory: this.inventory,
    // });
  }

  //   registerChat() {
  //     let chat = document.getElementById(CHAT);
  //     let messages = document.getElementById("messages");

  //     chat.onsubmit = (e) => {
  //       e.preventDefault();
  //       let message = document.getElementById("message");

  //       this.socket.emit(CHAT, message.value);
  //       message.value = "";
  //     };

  //     this.socket.on(CHAT, (name, message) => {
  //       console.log("*** recv CHAT: ", name, message);
  //       messages.innerHTML += `${name}: ${message}<br>`;
  //       messages.scrollTo(0, messages.scrollHeight);
  //     });
  //   }
}
