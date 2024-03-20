import express from "express";

import {
  login,
  logout,
  register,
  getOtherUsers,
  getUserProfile,
} from "../controllers/userController.js";

import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/userProfile/:id", isAuthenticated, getUserProfile);
router.get("/otherUsers", isAuthenticated, getOtherUsers);

export default router;
