import express from "express";

import { isAuthenticated } from "../middlewares/auth.js";

import { createTweet } from "../controllers/tweetController.js";

const router = express.Router();

router.post("/create", isAuthenticated, createTweet);

export default router;
