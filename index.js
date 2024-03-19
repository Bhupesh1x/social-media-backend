import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";

import "dotenv/config";

import connectToDb from "./config/db.js";

import userRoute from "./routes/userRoutes.js";

const PORT = process.env.PORT;

const app = express();

connectToDb();

// middlewares
app.use(cors());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// api routes
app.use("/api/user", userRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
