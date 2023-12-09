import express from "express";
import dotenv from "dotenv";
dotenv.config();
import path from "path";
import morgan from "morgan";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import { globalErrorHandler } from "./controllers/errorController.js";
import AppError from "./utils/appError.js";
import fs from "fs";
import thumbsupply from "thumbsupply";

// routes
import userRouter from "./routes/userRoutes.js";
import conversationRouter from "./routes/conversationRoute.js";
import messageRouter from "./routes/messageRoutes.js";

const app = express();

// morgan
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// helmet
app.use(helmet());

// parse json request url
app.use(express.json());

// cors
app.use(cors());

// Serving static files
app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

// mongo sanitize
app.use(mongoSanitize());

// cookie parser
app.use(cookieParser());

// compression
app.use(compression());

// file upload
// app.use(
//   fileUpload({
//     useTempFiles: true,
//   })
// );

app.get("/video/poster/:path", (req, res) => {
  thumbsupply
    .generateThumbnail(`public/img/files/${req.params.path}`)
    .then((thumb) => res.sendFile(thumb));
});
app.get("/video/:path", (req, res) => {
  const path = `public/img/files/${req.params.path}`;
  const stat = fs.statSync(path);

  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = end - start + 1;
    const file = fs.createReadStream(path, { start, end });
    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "video/mp4",
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    };
    res.writeHead(200, head);
    fs.createReadStream(path).pipe(res);
  }
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/conversation", conversationRouter);
app.use("/api/v1/messages", messageRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
