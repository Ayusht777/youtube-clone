// import mongoose from "mongoose";
// import { DB_NAME } from "./constants.js";
import { connectDB } from "./db/index.js";
import { app } from "./app.js";
connectDB()
  .then(
    app.on("err", (err) =>
      console.log(`app on error in index.js at src ${err}`)
    ),
    app.listen(process.env.PORT || 8080, () => {
      console.log(`app is listening at port ${process.env.PORT}`);
    })
  )
  .catch((err) => {
    console.log(`${err} while connecting db with app`);
  });

// import express from "express";
// const app = express();
// (async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//     app.on("error while connecting db", (err) => {
//       console.log(err);
//       throw err;
//     });
//     app.listen(process.env.PORT, () =>
//       console.log(`server is running  ${process.env.PORT} `)
//     );
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// })();
