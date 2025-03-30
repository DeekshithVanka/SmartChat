import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === "production"
      ? process.env.FRONTEND_URL
      : ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  },
  pingTimeout: 60000,
  cookie: true,
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// Store online users
const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  }

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    if (userId) {
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });

  // Handle errors
  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });
});

export { io, app, server };
