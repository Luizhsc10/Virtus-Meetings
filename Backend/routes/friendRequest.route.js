import express from "express";
import {
  sendFriendRequest,
  getFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
} from "../controllers/friendRequest.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, sendFriendRequest);
router.get("/", protectRoute, getFriendRequests);
router.put("/:id/accept", protectRoute, acceptFriendRequest);
router.put("/:id/reject", protectRoute, rejectFriendRequest);

export default router;
