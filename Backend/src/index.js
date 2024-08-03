// import mongoose from "mongoose";
// import { DB_NAME } from "./constants.js";
import { connectDB } from "./db/index.js";
import { app } from "./app.js";
const startServer = async () => {
  try {
    await connectDB();
    app.listen(process.env.PORT || 8080, () => {
      console.log(`app is listening at port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error(`${error} while connecting db with app`);
    process.exit(1);
  }
};

app.on("error", (err) => {
  console.error(`app on error in index.js at src: ${err}`);
});

startServer();
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
