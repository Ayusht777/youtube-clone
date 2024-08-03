import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));

app.use(express.json({ limit: "16kb" })); // it use for json data

app.use(express.urlencoded({ extended: true })); // it use for url handling  / routes

app.use(express.static("public")); // it is use to store files like data from pdf or images etc

app.use(cookieParser()); // use for cookies handling on server level

export { app };
