import mongoose from "mongoose";
import { DB_NAME } from "./constants";
import express from "express";
const app = express();
(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    app.on("error while connecting db", (err) => {
      console.log(err);
      throw err;
    });
    app.listen(process.env.PORT, () =>
      console.log(`server is running  ${process.env.PORT} `)
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
})();
