const express = require("express");
const app = express();
const connectDB = require("./config/database");
const cors = require("cors");
app.use(cors());
require("dotenv").config();

const cokkieParser = require("cookie-parser");

app.use(cokkieParser());

app.use(express.json());
const userRoutes = require("./routes/userRoutes");
const establismentResetPasswordRoutes = require("./routes/establismentResetPasswordRoute");

const port = process.env.PORT || 9000;

app.use("/", userRoutes);
app.use("/api/establisment/reset-password/", establismentResetPasswordRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

connectDB();


