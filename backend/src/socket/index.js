const { Server } = require("socket.io");
const pool = require("../db/pool");
const { verifyAccessToken } = require("../utils/jwt");
const { clientUrl } = require("../config/env");

function createSocketServer(httpServer) {
  const onlineCounts = new Map();

  const emitOnlineUsers = () => {
    const onlineUsers = Array.from(onlineCounts.entries())
      .filter(([, count]) => count > 0)
      .map(([id]) => Number(id));
    io.emit("onlineUsers", onlineUsers);
  };

  const io = new Server(httpServer, {
    cors: {
      origin: clientUrl,
      methods: ["GET", "POST"],
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error("Unauthorized"));
    }
    try {
      const user = verifyAccessToken(token);
      socket.user = user;
      return next();
    } catch (error) {
      return next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    const userId = String(socket.user.id);
    socket.join(userId);
    onlineCounts.set(userId, (onlineCounts.get(userId) || 0) + 1);
    emitOnlineUsers();

    socket.on("sendMessage", async (payload, callback) => {
      try {
        const senderId = Number(socket.user.id);
        const receiverId = Number(payload?.receiverId);
        const body = String(payload?.body || "").trim();

        if (!receiverId || !body) {
          callback?.({ ok: false, message: "Invalid message payload" });
          return;
        }

        const result = await pool.query(
          `INSERT INTO messages (sender_id, receiver_id, body)
           VALUES ($1, $2, $3)
           RETURNING id, sender_id, receiver_id, body, created_at`,
          [senderId, receiverId, body]
        );

        const message = result.rows[0];
        io.to(String(senderId)).to(String(receiverId)).emit("receiveMessage", message);
        callback?.({ ok: true, message });
      } catch (error) {
        callback?.({ ok: false, message: "Failed to send message" });
      }
    });

    socket.on("disconnect", () => {
      const nextCount = (onlineCounts.get(userId) || 1) - 1;
      if (nextCount <= 0) {
        onlineCounts.delete(userId);
      } else {
        onlineCounts.set(userId, nextCount);
      }
      emitOnlineUsers();
    });
  });

  return io;
}

module.exports = createSocketServer;
