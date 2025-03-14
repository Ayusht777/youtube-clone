import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import errorHandler from "./middlewares/errorMiddleware.js";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));

app.use(express.json({ limit: "16kb" })); // it use for json data

app.use(express.urlencoded({ extended: true })); // it use for url handling  / routes

app.use(express.static("public")); // it is use to store files like data from pdf or images etc

app.use(cookieParser()); // use for cookies handling on server level

//Routes
import commentRoutes from "./routes/comment.routes.js";
import communityRoutes from "./routes/community.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import healthCheckRoutes from "./routes/healthcheck.routes.js";
import likeRoutes from "./routes/like.routes.js";
import playlistRoutes from "./routes/playlist.routes.js";
import subscriptionRoutes from "./routes/subscriptions.routes.js";
import userRoutes from "./routes/user.routes.js";
import videoRoutes from "./routes/video.routes.js";
//Routes Declarations
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/videos", videoRoutes);
app.use("/api/v1/community", communityRoutes);
app.use("/api/v1/subscriptions", subscriptionRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/likes", likeRoutes);
app.use("/api/v1/playlists", playlistRoutes);
app.use("/api/v1/healthcheck", healthCheckRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

app.use(errorHandler);
//http:localhost:8080/api/v1/users/register

export { app };
