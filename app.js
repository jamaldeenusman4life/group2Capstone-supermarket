import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoute from "./src/routes/authRoute.js";
import orderRoute from "./src/routes/orderRoute.js";
import paymentRoute from "./src/routes/paymentRoute.js";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/orders", orderRoute);
app.use("/api/payments", paymentRoute);

app.get("/", (req, res) => {
  res.json({ message: "Supermarket API is running" });
});

export default app;
