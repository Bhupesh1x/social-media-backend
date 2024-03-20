import express from "express";

import { isAuthenticated } from "../middlewares/auth.js";

import {
  addComment,
  createTweet,
  deleteTweet,
  getAllTweets,
  getTweetById,
  likeOrDislike,
} from "../controllers/tweetController.js";

const router = express.Router();

router.post("/create", isAuthenticated, createTweet);
router.delete("/delete/:id", isAuthenticated, deleteTweet);
router.put("/likeordislike/:id", isAuthenticated, likeOrDislike);
router.post("/addComment", isAuthenticated, addComment);
router.get("/getAllTweets", isAuthenticated, getAllTweets);
router.get("/getTweetById/:id", isAuthenticated, getTweetById);

export default router;
