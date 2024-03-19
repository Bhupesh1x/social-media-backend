import mongoose from "mongoose";

import "dotenv/config";

function connectToDB() {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to mongo db"))
    .catch((error) => console.log("Mongo db connection error", error));
}

export default connectToDB;
