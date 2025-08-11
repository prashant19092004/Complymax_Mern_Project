require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const path = require("path");
const connectDB = require("./config/database");
const multer = require('multer');
const mongoose = require('mongoose');
const authRoutes = require("./routes/authRoute");
const userRoutes = require("./routes/userRoutes");
const establismentResetPasswordRoutes = require("./routes/establismentResetPasswordRoute");
const clientRoutes = require('./routes/clientRoutes');
const offerLetterRoutes = require('./routes/offerLetterRoutes');
const supervisorRoutes = require('./routes/supervisorRoute');
const establishmentRoutes = require('./routes/establishmentRoute');
const superAdminRoutes = require('./routes/superAdminRoute');
const leaveEmailRoutes = require('./routes/leaveEmailRoute.js');

const app = express();

// Allowed origins for CORS
const allowedOrigins = [
  "capacitor://localhost",
  "http://localhost",
  "http://localhost:3000",
  "https://localhost",
  "https://complymax.co.in",
  "http://192.168.135.81:3000"
];

// ✅ Universal CORS handler
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    console.log("⚡ Preflight request from:", origin, "→", req.originalUrl);
    return res.sendStatus(200);
  }

  next();
});

// ✅ Logging for debugging
app.use((req, res, next) => {
  console.log("🔥 Request:", req.method, req.originalUrl);
  console.log("📡 Origin:", req.headers.origin);
  console.log("📌 Referer:", req.headers.referer);

  res.on("finish", () => {
    console.log("🔍 CORS Headers Sent:", {
      "Access-Control-Allow-Origin": res.getHeader("Access-Control-Allow-Origin"),
      "Access-Control-Allow-Credentials": res.getHeader("Access-Control-Allow-Credentials")
    });
  });

  next();
});

// ✅ Middlewares
app.use(cookieParser());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Routes
app.use("/", authRoutes);
app.use("/api/user/", userRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/supervisor', supervisorRoutes);
app.use("/api/establisment/reset-password/", establismentResetPasswordRoutes);
app.use('/api/establishment/', establishmentRoutes);
app.use('/api/offer-letter', offerLetterRoutes);
app.use('/api/super-admin', superAdminRoutes);
app.use('/api/', leaveEmailRoutes);
// ... other routes ...

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Something broke!",
    error: err.message
  });
});



// ✅ Start server
connectDB();
require("./cron/markAbsentees.js");
require("./cron/fetchHolidayForNewYear.js");

app.listen(process.env.PORT || 8000, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${process.env.PORT || 8000}`);
});
