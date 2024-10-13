const jwt = require("jsonwebtoken");
const supervisorModel = require("../models/supervisor.model");
const superadminModel = require("../models/superadmin.model");

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

exports.isSupervisor = async (req, res, next) => {
  try {
    const supervisor = await supervisorModel.findOne({email : req.user.email}, {_id:1});
    if (!supervisor) {
      res.status(401).json({
        success: false,
        role: req.user.role,
        message: "this is for Supervisor stay away",
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

exports.isSuperadmin = async (req, res, next) => {
  try {
    const superadmin = await superadminModel.findOne({email : req.user.email}, {_id:1});
    if (!superadmin) {
      res.status(401).json({
        success: false,
        message: "this is for Superadmin stay away",
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
