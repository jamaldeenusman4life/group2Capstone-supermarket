import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoute from "./src/routes/authRoute.js";
import promotionRoute from "./src/routes/promotionRoute.js";
import notificationRoute from "./src/routes/notificationRoute.js";
import reportRoute from "./src/routes/reportRoute.js";
import orderRoute from "./src/routes/orderRoute.js";
import paymentRoute from "./src/routes/paymentRoute.js";
import customerRoute from "./src/routes/customerRoute.js";
import deliveryRoute from "./src/routes/deliveryRoute.js";
import supplierRoute from "./src/routes/supplierRoute.js";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/promotions", promotionRoute);
app.use("/api/notifications", notificationRoute);
app.use("/api/reports", reportRoute);
app.use("/api/orders", orderRoute);
app.use("/api/payments", paymentRoute);
app.use("/api/deliveries", deliveryRoute);
app.use("/api/suppliers", supplierRoute);
app.use("/api/customers", customerRoute);

app.get("/", (req, res) => {
  res.json({ message: "Supermarket API is running" });
});

app.post("/", (req, res) => {
  res.json({ message: "Customer API is running" });
  console.log("Customer API is running:", req.body);
});

export default app;
