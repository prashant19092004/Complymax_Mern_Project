const express = require("express");
const app = express();
const connectDB = require("./config/database");
const cors = require("cors");
const multer = require('multer');
const path = require('path');


app.use(cors());
app.use('/uploads', express.static('uploads'));
require("dotenv").config();

const _dirname = path.resolve();

// Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const cokkieParser = require("cookie-parser");

app.use(cokkieParser());

app.use(express.json());
const userRoutes = require("./routes/userRoutes");
const establismentResetPasswordRoutes = require("./routes/establismentResetPasswordRoute");

const port = process.env.PORT || 9000;

app.use("/", userRoutes);
app.use("/api/establisment/reset-password/", establismentResetPasswordRoutes);

app.use(express.static(path.join(_dirname, "/frontend/build")));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(_dirname, "frontend", "build", "index.html"));
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

connectDB();


