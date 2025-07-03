import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import messageRouter from "./routes/message.routes.js";

const port = process.env.PORT || 5000;

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/message", messageRouter);

app.listen(port, () => {
  connectDb();
  console.log("Server Started");
});
