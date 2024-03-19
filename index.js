import cors from "cors";
import express from "express";

import "dotenv/config";

import connectToDb from "./config/db.js";

const PORT = process.env.PORT;

const app = express();

connectToDb();

app.use(cors());
app.use(express.json());

app.get("/test", (req, res) => {
  res.send("Hello world!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
