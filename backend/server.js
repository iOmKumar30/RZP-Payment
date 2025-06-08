const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const { connectDB } = require("./config/db");

dotenv.config();

const app = express();

// (adjust frontend domain as needed)
// "https://rzp-payment.vercel.app"
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan("dev"));

connectDB();

const paymentRoutes = require("./routes/payment");
const donationRoutes = require("./routes/donationRoutes");

app.use("/api/payment", paymentRoutes);
app.use("/api/donations", donationRoutes);

app.get("/", (_req, res) => res.send("RZP Payment Backend is Live!"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
