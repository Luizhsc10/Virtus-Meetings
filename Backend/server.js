import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import friendRequestRoutes from "./routes/friendRequest.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

const httpServer = createServer(app);

export const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  },
});

const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join-user-room", (userId) => {
    onlineUsers.set(userId, socket.id);
    socket.join(userId);
    io.emit("online-users", Array.from(onlineUsers.keys()));
  });

  socket.on("join-conversation", (conversationId) => {
    socket.join(conversationId);
  });

  socket.on("typing", ({ conversationId, userId, fullName }) => {
    socket.to(conversationId).emit("typing", {
      conversationId,
      userId,
      fullName,
    });
  });

  socket.on("stop-typing", ({ conversationId, userId }) => {
    socket.to(conversationId).emit("stop-typing", {
      conversationId,
      userId,
    });
  });

  socket.on("disconnect", () => {
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }

    io.emit("online-users", Array.from(onlineUsers.keys()));
    console.log("User disconnected:", socket.id);
  });
});

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  }),
);

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/friend-requests", friendRequestRoutes);
app.use("/api/messages", messageRoutes);

const startServer = async () => {
  try {
    await connectDB();
    httpServer.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
  }
};

startServer();
