import express from "express";

import {
  login,
  logout,
  register,
  getUserProfile,
} from "../controllers/userController.js";

import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/userProfile/:id", isAuthenticated, getUserProfile);

export default router;
