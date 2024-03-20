import express from "express";

import {
  login,
  logout,
  register,
  getOtherUsers,
  getUserProfile,
  followOrUnfollow,
} from "../controllers/userController.js";

import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/userProfile/:id", isAuthenticated, getUserProfile);
router.get("/otherUsers", isAuthenticated, getOtherUsers);
router.put("/followOrUnfollow/:id", isAuthenticated, followOrUnfollow);

export default router;
