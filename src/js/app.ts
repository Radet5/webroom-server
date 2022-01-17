import express from "express";
import cors from "cors";

import { Server } from "socket.io";
import { createServer } from "http";

//import apiRoutes from "./routes/api-routes";
import { apiRoutes } from "./routes/api-routes";

const app = express();
const port = 3000;

app.use(cors());
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:1234",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());

app.use("/api/", apiRoutes);

app.listen(port, () => {
  console.log(`webroom is running on port ${port}.`);
});

const users: any = {};

const socketToRoom: any = {};

io.on("connection", (socket) => {
  socket.on("join room", () => {
    const roomID = 5;
    if (users[roomID]) {
      const length = users[roomID].length;
      if (length === 2) {
        socket.emit("room full");
        return;
      }
      users[roomID].push(socket.id);
    } else {
      users[roomID] = [socket.id];
    }
    socketToRoom[socket.id] = roomID;
    const usersInThisRoom = users[roomID].filter((id: any) => id !== socket.id);

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
    let room = users[roomID];
    if (room) {
      room = room.filter((id: any) => id !== socket.id);
      users[roomID] = room;
      socket.broadcast.emit("user left", socket.id);
    }
  });
});

server.listen(process.env.PORT || 8000, () =>
  console.log("server is running on port 8000")
);
