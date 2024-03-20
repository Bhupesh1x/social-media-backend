import express from "express";

import { isAuthenticated } from "../middlewares/auth.js";

import {
  createTweet,
  deleteTweet,
  likeOrDislike,
} from "../controllers/tweetController.js";

const router = express.Router();

router.post("/create", isAuthenticated, createTweet);
router.delete("/delete/:id", isAuthenticated, deleteTweet);
router.put("/likeordislike/:id", isAuthenticated, likeOrDislike);

export default router;
