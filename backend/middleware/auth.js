const jwt = require("jsonwebtoken");

require("dotenv").config();

exports.auth = async (req, res, next) => {
  try {
    const token =
      // req.body.token ||
      // req.cookies.token ||
      req.header("Authorization").replace("Bearer ", "");
    // console.log(token);
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decode;
    } catch (e) {
      return res.status(401).json({
        success: false,
        message: "token is invalid",
      });
    }

    next();
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};

exports.isStudent = async (req, res, next) => {
  try {
    if (req.user.role !== "Student") {
      res.status(401).json({
        success: false,
        role: req.user.role,
        message: "this is for student stay away",
      });
    }
    next();
  } catch (e) {
    res.status(401).json({
      success: false,
      message: "internal server error",
    });
  }
};

exports.isAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(401).json({
        success: false,
        role: req.user.role,
        message: "This is for admins only.",
      });
    }
    next();
  } catch (e) {
    res.status(401).json({
      success: false,
      message: "internal server error",
    });
  }
};
