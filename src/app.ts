import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import config from "./config";
import userRoute from "./modules/user/users.route";
import authRoute from "./modules/auth/auth.routes";
import postRoute from "./modules/post/post.route";
import commentRoutes from "./modules/comment/comment.route";

const app: Application = express();

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

// Routes
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});
app.use("/users", userRoute);
app.use("/auth", authRoute);
app.use("/posts", postRoute )
app.use("/comments", commentRoutes)

export default app;
