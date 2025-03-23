const express = require("express");
const app = express();
const connectDB = require("./config/database");
const cors = require("cors");
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');


app.use(cors());
require("dotenv").config();

// Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const cokkieParser = require("cookie-parser");

app.use(cokkieParser());

app.use(express.json());
const userRoutes = require("./routes/userRoutes");
const establismentResetPasswordRoutes = require("./routes/establismentResetPasswordRoute");
const clientRoutes = require('./routes/clientRoutes');

const port = process.env.PORT || 8000;

app.use("/", userRoutes);
app.use('/client', clientRoutes);
app.use("/api/establisment/reset-password/", establismentResetPasswordRoutes);

// app.use(express.static(path.join(_dirname, "/frontend/build")));
// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(_dirname, "frontend", "build", "index.html"));
// })

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

connectDB();

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB is connected'))
.catch((err) => console.log(err));


