import BaseModel from "../utilities/base-model";
import {
  NEW_PLAYER,
  ALL_PLAYERS,
  CHAT,
  KEY_PRESS,
  MOVE,
  STOP,
  REMOVE,
} from "../../shared/constants/playerAction";
import { WORLD, ROOM1, ROOM2 } from "../../shared/constants/sceneList";

let playersArray = [];

class serverPlayer extends BaseModel {
  constructor(id, position, avatar) {
    super(id, position.x, position.y);
    this.direction = position.direction;
    this.avatar = avatar;
  }

  static onConnect(io, socket) {
    let player;

    socket.on(NEW_PLAYER, (room, position, avatar) => {
      console.log("*** serverPlayer on NEW_PLAYER: ", room, position, avatar);
      socket.join(room);
      socket.room = room;

      player = new serverPlayer(socket.id, position, avatar);
      //console.log("player: ", player);
      //console.log("serverPlayer.list: ", serverPlayer.list);

      serverPlayer.list[room][socket.id] = player;

      playersArray = []; // clear array
      for (let i in serverPlayer.list[room]) {
        playersArray.push(serverPlayer.list[room][i]);
      }

      console.log("*** serverPlayer emit ALL_PLAYER: ", playersArray);
      socket.emit(ALL_PLAYERS, playersArray);

      console.log("*** serverPlayer bcast to room, emit NEW_PLAYER: ", player);
      socket.broadcast.to(room).emit(NEW_PLAYER, player);

      console.log("============ AFTER NEW_PLAYER ============");
      console.log("serverPlayer.list: ", serverPlayer.list);
    });

    socket.on(CHAT, (message) => {
      console.log("*** serverPlayer on CHAT: ", message);
      io.to(socket.room).emit(CHAT, socket.id.substring(0, 5), message);
    });

    socket.on(KEY_PRESS, (direction, coor) => {
      //console.log("*** serverPlayer on KEY_PRESS: ", direction, coor);
      player.update(direction, coor);
      socket.broadcast.to(socket.room).emit(MOVE, player);
    });

    socket.on(STOP, (coor) => {
      //console.log("*** serverPlayer on STOP: ", coor);
      player.updatePosition(coor);
      socket.broadcast.to(socket.room).emit(STOP, player);
    });

    socket.on(REMOVE, (id, room) => {
      console.log("*** serverPlayer bcast to room, REMOVE: ", id, room);
      socket.broadcast.to(room).emit(REMOVE, id, room);

      if (serverPlayer.list[room]) {
        console.log("*** removing player :", id, room);
        delete serverPlayer.list[room][id];
      }

      console.log("============ AFTER REMOVE ==============");
      console.log("serverPlayer.list: ", serverPlayer.list);
    });
  }

  static onDisconnect(io, socket) {
    console.log("*** serverPlayer onDisconnect: ");

    if (serverPlayer.list[socket.room]) {
      console.log("*** removing player :", socket.id);
      delete serverPlayer.list[socket.room][socket.id];

      io.to(socket.room).emit(REMOVE, socket.id);

      console.log("============ AFTER DISCONNECT ============");
      console.log("serverPlayer.list: ", serverPlayer.list);
    }
  }

  updatePosition(coor) {
    this.x = coor.x;
    this.y = coor.y;
  }

  update(direction, coor) {
    this.updatePosition(coor);
    this.direction = direction;
  }
}

// List all the players in different scenes
serverPlayer.list = {};
serverPlayer.list[WORLD] = {};
serverPlayer.list[ROOM1] = {};
serverPlayer.list[ROOM2] = {};

export default serverPlayer;
