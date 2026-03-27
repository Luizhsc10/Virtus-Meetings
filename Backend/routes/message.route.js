import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getUserConversations,
  createOrGetConversation,
  getMessages,
  sendMessage,
  markMessagesAsRead,
} from "../controllers/message.controller.js";

const router = express.Router();

router.get("/conversations", protectRoute, getUserConversations);
router.post("/conversations", protectRoute, createOrGetConversation);
router.get("/:conversationId", protectRoute, getMessages);
router.post("/:conversationId", protectRoute, sendMessage);
router.put("/:conversationId/read", protectRoute, markMessagesAsRead);

export default router;
