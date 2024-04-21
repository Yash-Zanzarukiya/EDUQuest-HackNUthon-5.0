import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

//import Routes
import userRouter from "./routes/users.js";
import videoRouter from "./routes/video.js";
import topicRouter from "./routes/topic.js";
import sectionRouter from "./routes/section.js";
import purchaseRouter from "./routes/purchase.js";
import progressRouter from "./routes/progress.js";
import courseRouter from "./routes/course.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/topic", topicRouter);
app.use("/api/v1/section", sectionRouter);
app.use("/api/v1/purchase", purchaseRouter);
app.use("/api/v1/progress", progressRouter);
app.use("/api/v1/course", courseRouter);

export { app };
