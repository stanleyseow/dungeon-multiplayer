import express from "express";
import Bundler from "parcel-bundler";
import path from "path";
import http from "http";
import socket from "socket.io";
import serverPlayer from "./models/serverPlayer";

const app = express();
const server = http.Server(app);
const io = socket(server);
const port = process.env.PORT || 8080;
const bundler = new Bundler(path.resolve(__dirname, "../client/index.html"));

app.use(bundler.middleware());

server.listen(port, () => {
  console.log(`App now listening on port ${port}`);
});

io.on("connection", function (socket) {
  serverPlayer.onConnect(io, socket);

  socket.on("disconnect", function () {
    serverPlayer.onDisconnect(io, socket);
  });
});
