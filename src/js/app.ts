import express from "express";
import cors from "cors";
import { v4 } from "uuid";
import fs from "fs";

import { Server } from "socket.io";
import { createServer } from "https";

//import apiRoutes from "./routes/api-routes";
import { apiRoutes } from "./routes/api-routes";
const privateKey = fs.readFileSync(
  "/etc/letsencrypt/live/radet5.com/privkey.pem",
  "utf8"
);
const certificate = fs.readFileSync(
  "/etc/letsencrypt/live/radet5.com/cert.pem",
  "utf8"
);
const ca = fs.readFileSync(
  "/etc/letsencrypt/live/radet5.com/chain.pem",
  "utf8"
);
const credentials = {
  key: privateKey,
  cert: certificate,
  ca,
};

const app = express();
const port = 3000;

app.use(cors());
const server = createServer(credentials, app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());

app.use("/api/", apiRoutes);

app.listen(port, () => {
  console.log(`webroom is running on port ${port}.`);
});

const rooms: any = {};

const socketToRoom: any = {};

let roomID = "";
io.on("connection", (socket) => {
  socket.on("join room", () => {
    const availableRooms = Object.keys(rooms).filter(
      (roomID) => rooms[roomID].length < 4
    );
    if (availableRooms.length > 0) {
      roomID = availableRooms[0];
    }
    if (rooms[roomID] && rooms[roomID].length < 4) {
      rooms[roomID].push(socket.id);
    } else {
      roomID = v4();
      rooms[roomID] = [socket.id];
    }
    console.log(roomID);
    socketToRoom[socket.id] = roomID;
    const usersInThisRoom = rooms[roomID].filter((id: any) => id !== socket.id);

    socket.emit("all users", usersInThisRoom);
  });

  socket.on("sending signal", (payload) => {
    io.to(payload.userToSignal).emit("user joined", {
      signal: payload.signal,
      callerID: payload.callerID,
    });
  });

  socket.on("returning signal", (payload) => {
    io.to(payload.callerID).emit("receiving returned signal", {
      signal: payload.signal,
      id: socket.id,
    });
  });

  socket.on("disconnect", () => {
    const roomID = socketToRoom[socket.id];
    let room = rooms[roomID];
    if (room) {
      room = room.filter((id: any) => id !== socket.id);
      rooms[roomID] = room;
      socket.broadcast.emit("user left", socket.id);
    }
  });
});

server.listen(process.env.PORT || 8000, () =>
  console.log("server is running on port 8000")
);
