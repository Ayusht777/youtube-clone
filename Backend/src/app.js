import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));

app.use(express.json({ limit: "16kb" })); // it use for json data

app.use(express.urlencoded({ extended: true })); // it use for url handling  / routes

app.use(express.static("public")); // it is use to store files like data from pdf or images etc

app.use(cookieParser()); // use for cookies handling on server level

//Routes
import userRoutes from "./routes/user.routes.js";
import videoRoutes from "./routes/video.routes.js";
import communityRoutes from "./routes/community.routes.js";
import subscriptionRoutes from "./routes/subscriptions.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import likeRoutes from "./routes/like.routes.js";
import playlistRoutes from "./routes/playlist.routes.js";

//Routes Declarations
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/videos", videoRoutes);
app.use("/api/v1/community", communityRoutes);
app.use("/api/v1/subscriptions", subscriptionRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/likes", likeRoutes);
app.use("/api/v1/playlists", playlistRoutes);

//http:localhost:8080/api/v1/users/register

export { app };
