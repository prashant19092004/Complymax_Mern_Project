require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const connectDB = require("./config/database");

const allowedOrigins = [
  "capacitor://localhost",
  "http://localhost",
  "http://localhost:3000",
  "https://localhost",
  "https://complymax.co.in",
  "http://192.168.135.81:3000"
];

// ✅ Force CORS headers before anything else
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// ✅ Logging to debug CORS
app.use((req, res, next) => {
  console.log("🔥 Request:", req.method, req.originalUrl);
  console.log("Origin:", req.headers.origin);
  console.log("Referer:", req.headers.referer);

  res.on("finish", () => {
    console.log("🔍 CORS Headers Sent:", {
      origin: res.getHeader("Access-Control-Allow-Origin"),
      creds: res.getHeader("Access-Control-Allow-Credentials")
    });
  });

  next();
});

// ✅ Middleware
app.use(cookieParser());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Routes
app.use("/", require("./routes/authRoute"));
app.use("/api/user", require("./routes/userRoutes"));
// ... other routes ...

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    message: "Something broke!",
    error: err.message 
  });
});

connectDB();
app.listen(process.env.PORT || 8000, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${process.env.PORT || 8000}`);
});
