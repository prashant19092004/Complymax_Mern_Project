const express = require("express")
const router = express.Router();
const superAdminController = require("../controllers/superAdminController");
const { auth, isSuperadmin } = require("../middleware/auth");

router.get("/dashboard",auth, isSuperadmin, superAdminController.getSuperAdminDashboard);



module.exports = router
