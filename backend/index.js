const express = require("express");
const app = express();
const connectDB = require("./config/database");
const cors = require("cors");
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// CORS configuration
// app.use(cors());
// ✅ Allowed origins
const allowedOrigins = [
  "capacitor://localhost",
  "http://localhost",
  "http://localhost/",
  "https://localhost/",
  "https://localhost",
  "http://localhost:3000",
  "https://complymax.co.in",
];

// ✅ Custom CORS options
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn("❌ CORS blocked for origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// ✅ Handle preflight requests with same config
app.options("*", cors(corsOptions));

// ✅ Log origin, referer, method
app.use((req, res, next) => {
  console.log("Origin:", req.headers.origin);
  console.log("Referer:", req.headers.referer);
  console.log("Method:", req.method);
  next();
});


// ✅ Apply CORS middleware globally
app.use(cors(corsOptions));



require("dotenv").config();

// Body parser configuration with increased limits
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const cokkieParser = require("cookie-parser");
app.use(cokkieParser());

// Routes setup
const authRoutes = require("./routes/authRoute");
const userRoutes = require("./routes/userRoutes");
const establismentResetPasswordRoutes = require("./routes/establismentResetPasswordRoute");
const clientRoutes = require('./routes/clientRoutes');
const offerLetterRoutes = require('./routes/offerLetterRoutes');
const supervisorRoutes = require('./routes/supervisorRoute');
const establishmentRoutes = require('./routes/establishmentRoute');
const superAdminRoutes = require('./routes/superAdminRoute');
const leaveEmailRoutes = require('./routes/leaveEmailRoute.js');

const port = process.env.PORT || 8000;

// Route middleware
app.use("/", authRoutes);
app.use("/api/user/", userRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/supervisor', supervisorRoutes);
app.use("/api/establisment/reset-password/", establismentResetPasswordRoutes);
app.use('/api/establishment/', establishmentRoutes);
app.use('/api/offer-letter', offerLetterRoutes);
app.use('/api/super-admin', superAdminRoutes);
app.use('/api/', leaveEmailRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    message: 'Something broke!',
    error: err.message 
  });
});

connectDB();
require("./cron/markAbsentees.js");
require("./cron/fetchHolidayForNewYear.js");

app.listen(port, '0.0.0.0', () => {
  console.log("Server running on http://<your-ip>:5000");
});




