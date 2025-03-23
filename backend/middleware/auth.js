const jwt = require("jsonwebtoken");
const supervisorModel = require("../models/supervisor.model");
const superadminModel = require("../models/superadmin.model");

require("dotenv").config();

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};

const isSupervisor = async (req, res, next) => {
  try {
    const supervisor = await supervisorModel.findOne({email : req.user.email}, {_id:1});
    if (!supervisor) {
      return res.status(401).json({
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

const isSuperadmin = async (req, res, next) => {
  try {
    const superadmin = await superadminModel.findOne({email : req.user.email}, {_id:1});
    if (!superadmin) {
      return res.status(401).json({
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

const isAdmin = async (req, res, next) => {
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

module.exports = {
  auth,
  isSupervisor,
  isSuperadmin,
  isAdmin
};
