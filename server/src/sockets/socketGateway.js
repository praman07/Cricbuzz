import { Server } from "socket.io";
import logger from "../config/logger.js";
import env from "../config/env.js"

/**
 * Socket Gateway
 * ─────────────────────────────────────────────────────────────────────
 * Module-scope singleton — ioInstance ek baar set hota hai initSocket()
 * se, phir emitToMatch() se saari services use karte hain.
 * ─────────────────────────────────────────────────────────────────────
 */

let ioInstance = null;

/**
 * Socket.IO initialize karo — server.js se call hota hai.
 * @param {import("http").Server} httpServer
 */
export const initSocket = (httpServer) => {
  const allowedOrigins = env.CORS_ORIGIN
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  ioInstance = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
    },
  });

  ioInstance.on("connection", (socket) => {
    logger.info({ socketId: socket.id }, "Client connected");

    // Client match room mein join karta hai
    socket.on("join-match", (matchId) => {
      socket.join(`match:${matchId}`);
      logger.info({ socketId: socket.id, matchId }, "Joined match room");
    });

    // Dash notation alias
    socket.on("join_match", (matchId) => {
      socket.join(`match:${matchId}`);
    });

    // Client match room se leave karta hai
    socket.on("leave-match", (matchId) => {
      socket.leave(`match:${matchId}`);
      logger.info({ socketId: socket.id, matchId }, "Left match room");
    });

    socket.on("leave_match", (matchId) => {
      socket.leave(`match:${matchId}`);
    });

    socket.on("disconnect", () => {
      logger.info({ socketId: socket.id }, "Client disconnected");
    });
  });

  logger.info("Socket.IO initialized");

  return ioInstance;
};

/**
 * Match room mein event emit karo.
 * Service layer se call hota hai — DB write ke baad.
 * No-op agar ioInstance null hai (unit tests mein).
 *
 * @param {string} matchId - Match ObjectId
 * @param {string} event - Event name
 * @param {object} payload - Event data
 */
export const emitToMatch = (matchId, event, payload) => {
  if (!ioInstance || !matchId) return;

  ioInstance.to(`match:${matchId}`).emit(event, payload);

  logger.info({ matchId, event }, "Socket event emitted");
};