const express = require('express');
const router = express.Router();

const { userlogin, usersignup, adminsignup, adminlogin, clientregister, clientlogin, supervisorlogin, supervisorregister, superadminlogin, superadminsignup } = require("../controller/auth");
const { auth, isEstablishment } = require("../middleware/auth");


// router.post("/login", login)
router.post("/usersignup", usersignup)
router.post("/userlogin", userlogin)
router.post("/adminsignup", adminsignup)
router.post("/adminlogin", adminlogin)
router.post("/api/establishment/client_register", auth, isEstablishment, clientregister);
router.post("/clientlogin", clientlogin);
router.post("/api/establishment/supervisor_register", auth, isEstablishment, supervisorregister);
router.post("/supervisorlogin", supervisorlogin);
router.post("/superadmin-login", superadminlogin);
router.post("/superadmin-sighup", superadminsignup);

module.exports = router;