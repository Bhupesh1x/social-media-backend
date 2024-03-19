import cors from "cors";
import express from "express";

import "dotenv/config";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/test", (req, res) => {
  res.send("Hello world!");
});

app.listen(8080, () => {
  console.log(`Server is running on port:8080`);
});
