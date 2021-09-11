import express from "express";
import cors from "cors";
import morgan from "morgan";
import { createServer } from "http";
import { Server } from "socket.io";

import api from "./routes/api.js";
import { getUsersByRoom, createRoom, joinRoom, handleUserLeave, saveMyCards } from "./controllers/room/roomController.js";

const app = express();
const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000"],
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(morgan("dev"));

//api routes
app.use("/api", api);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => console.log(`server started at http://localhost:${PORT}`));

io.on("connection", (socket) => {
  //Create room
  socket.on("create-room", ({ name, publicRoom, privateRoom, roomId, roomPassword }) => {
    createRoom(name, publicRoom, privateRoom, roomId, socket.id, roomPassword);
    socket.join(roomId);
    console.log(socket.id);
    console.log(roomId);
    let users = getUsersByRoom(roomId);
    io.to(roomId).emit("get-users-by-room", users);
  });

  //Join Room
  socket.on("join-room", ({ name, publicRoom, privateRoom, roomId, roomPassword }) => {
    let JoinRoomRes = joinRoom(name, publicRoom, privateRoom, roomId, socket.id, roomPassword);
    if (JoinRoomRes.status) {
      socket.join(roomId);
      let users = getUsersByRoom(roomId);
      io.to(roomId).emit("get-users-by-room", users);
    }
    io.to(socket.id).emit("join-room-response", JoinRoomRes);
  });

  //get users by room

  socket.on("get-users-by-room", (roomId) => {
    console.log("get-users");
    let users = getUsersByRoom(roomId);
    console.log(users);
    io.to(roomId).emit("get-users-by-room", users);
  });

  //when user disconnect

  socket.on("disconnect", () => {
    const user = handleUserLeave(socket.id);
    if (user) {
      let users = getUsersByRoom(user.roomId);
      io.to(user.roomId).emit("get-users-by-room", users);
    }
    console.log(user);
  });

  //socket leave

  socket.on("leave-room", () => {
    const user = handleUserLeave(socket.id);
    if (user) {
      let users = getUsersByRoom(user.roomId);
      io.to(user.roomId).emit("get-users-by-room", users);
    }
    console.log("leave-user");
  });

  //save cards in memory

  socket.on("save-my-cards", (cards) => {
    console.log(cards);
    saveMyCards(socket.id);
  });
});
