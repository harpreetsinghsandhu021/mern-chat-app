import app from "./app.js";
import dotenv from "dotenv";
import logger from "./configs/logger.js";
import mongoose from "mongoose";
import { Server } from "socket.io";
import SocketServer from "./socketServer.js";

dotenv.config();

const port = process.env.PORT || 6000;

process.on("uncaughtException", (err) => {
  console.log("UNHANDLED Exception! 💥 Shutting down...");
  logger.error(err);
  process.exit(1);
});

const DB = process.env.DB.replace("<password>", process.env.DATABASE_PASSWORD);

mongoose
  .connect(DB, {})
  .then(() => logger.info("DB connection successful! " + "🚀🚀"));

const server = app.listen(port, () => {
  logger.info("server running on port " + port + " 🚀🚀");
});

const io = new Server(server, {
  pingTimeout: 60000,
  forceNew: true,
  cors: {
    origin: process.env.CLIENT_ENDPOINT,
  },
});

io.on("connection", (socket) => {
  logger.info("socket io connected successfully.");
  SocketServer(socket, io);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.error(err);
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");
  server.close(() => {
    console.log("💥 Process terminated!");
  });
});
