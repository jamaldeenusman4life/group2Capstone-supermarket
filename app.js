import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoute from "./src/routes/authRoute.js";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/auth", authRoute);

app.get("/", (req, res) => {
  res.json({ message: "Supermarket API is running" });
});

export default app;
