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

class Player extends Phaser.GameObjects.Sprite {
  constructor(scene, room, position) {
    super(scene);

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

  create(key) {
    playerKey = key;
    leftKey = "left-" + key;
    rightKey = "right-" + key;
    upKey = "up-" + key;
    downKey = "down-" + key;

    this.socket.emit(NEW_PLAYER, this.room, this.position);
    console.log("*** emit player.create NEW_PLAYER");

    this.socket.on(NEW_PLAYER, (data) => {
      console.log("*** recv NEW_PLAYER: ", data);
      this.addPlayer(data.id, data.x, data.y, data.direction);
    });

    this.socket.on(ALL_PLAYERS, (data) => {
      console.log("*** recv ALL_PLAYER: ", data);
      this.scene.cameras.main.fadeFrom(FADE_DURATION);
      this.scene.scene.setVisible(true, this.room);

      for (let i = 0; i < data.length; i++) {
        this.addPlayer(data[i].id, data[i].x, data[i].y, data[i].direction);
      }

      this.scene.cameras.main.startFollow(
        this.playersObj[this.socket.id],
        true
      );

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

      this.socket.on(REMOVE, (id) => {
        console.log("*** recv REMOVE: ", id);
        this.playersObj[id].destroy();
        delete this.playersObj[id];
      });

      // Implement chat later
      //this.registerChat();
    });
  }

  addPlayer(id, x, y, direction) {
    console.log("*** addPlayer: ", id, x, y, direction);
    // Change here to get different avatar

    this.playersObj[id] = this.scene.physics.add
      .sprite(x, y, playerKey)
      .setScale(2);
    this.playersObj[id].anims.play(downKey);
    this.playersObj[id].anims.stop();

    this.currentPlayer = this.playersObj[this.socket.id];
    //console.log("currentPlayer: ", this.currentPlayer);
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

export default Player;
