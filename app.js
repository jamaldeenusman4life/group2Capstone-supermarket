import express from "express";
import cors from "cors";
import morgan from "morgan";
//import authRoute from "./src/routes/authRoute.js";
import customRoute from "./src/routes/customRoute.js";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());


//app.use("/api/auth", authRoute);

app.use("/api/customers", customRoute);

//app.get("/", (req, res) => {
  //res.json({ message: "Supermarket API is running" });
//});

app.post("/", (req, res) => {
  res.json({ message: "Customer API is running" });
  console.log("Customer API is running:", req.body);
});

export default app;
