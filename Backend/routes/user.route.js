import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getCurrentUser,
  onboardUser,
  discoverUsers,
  getUserFriends,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/me", protectRoute, getCurrentUser);
router.put("/onboarding", protectRoute, onboardUser);
router.get("/discover", protectRoute, discoverUsers);
router.get("/friends", protectRoute, getUserFriends);

export default router;
