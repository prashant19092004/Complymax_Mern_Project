const express = require("express");
const router = express.Router();
const superadminModel = require("../models/superadmin.model.js");
const userModel = require("../models/user.js");
const clientModel = require("../models/client.model.js");
const supervisorModel = require("../models/supervisor.model.js");
const educationModel = require("../models/education.model.js");
const experienceModel = require("../models/experience.model.js");
const clientlocationModel = require("../models/clientlocation.model.js");
const hiringModel = require("../models/hiring.model.js");
const hiredModel = require("../models/hired.model.js");
const { uploadImage } = require("../middleware/multer.js");
const { uploadImageAndPdf } = require("../middleware/multer.js");
const path = require("path");
const fs = require("fs");
const userController = require("../controllers/userController");

// Increase EventEmitter max listeners
require("events").EventEmitter.defaultMaxListeners = 15;

const { auth, isUser } = require("../middleware/auth");

router.get("/profile", auth, isUser, userController.profileData);

//user dashboard
router.get("/user-dashboard", auth, isUser, userController.userDashboard);
router.get("/jobdashboard", auth, isUser, userController.jobDashboard);
router.post("/profile/add_uan_esic", auth, isUser, userController.addUanEsic);
router.post("/profile/add_Account", auth, isUser, userController.addAccount);

router.get("/profile_pic", auth, async (req, res) => {
  const currentUser = await userModel.findOne(
    {
      _id: req.user.id,
    },
    {
      _id: 1,
      profilePic: 1,
    }
  );

  res.send(currentUser);
});

router.post("/profile/add_Pan", auth, isUser, userController.addPan);

router.post("/add_education", auth, isUser, userController.addEducation);

router.post("/add_experience", auth, isUser, userController.addExperience);

router.post("/delete_education", auth, isUser, userController.deleteEducation);
router.post(
  "/delete_experience",
  auth,
  isUser,
  userController.deleteExperience
);

router.post(
  "/upload/profile-pic",
  uploadImage.single("image"),
  auth,
  isUser,
  userController.uploadProfilePic
);

router.post(
  "/upload/pan-image",
  uploadImageAndPdf.single("image"),
  auth,
  isUser,
  userController.uploadPanImage
);

// router.post('/upload/aadhar-image', uploadImageAndPdf.single('image'), auth, async (req, res) => {
//     try {
//         const user = await userModel.findOneAndUpdate(
//             { _id: req.user.id },
//             { aadhar_image: `/uploads/${req.file.filename}` },
//             { new: true, runValidators: false } // Disable validation for this update
//         );

//         if (!user) {
//             return res.status(404).json({ msg: 'User not found' });
//         }

//         res.json({ msg: 'Aadhar card image uploaded successfully', user });
//     } catch (error) {
//         console.error('Upload error:', error);
//         res.status(500).json({ msg: 'Server error', error: error.message });
//     }
// });

router.post("/delete/pan-image", auth, isUser, userController.deletePanImage);

router.post(
  "/delete/aadhar-front-image",
  auth,
  isUser,
  userController.deleteAadharFrontImage
);

router.post(
  "/delete/aadhar-back-image",
  auth,
  isUser,
  userController.deleteAadharBackImage
);

// Add this route for certificate upload
router.post(
  "/upload/certificate",
  uploadImageAndPdf.single("certificate"),
  auth,
  isUser,
  userController.uploadCertificate
);

// Add this route for certificate deletion
router.post(
  "/delete/certificate",
  auth,
  isUser,
  userController.deleteCertificate
);

// Add account image upload route
router.post(
  "/upload/account-image",
  uploadImageAndPdf.single("image"),
  auth,
  isUser,
  userController.uploadAccountImage
);

// Add account image delete route
router.post(
  "/delete/account-image",
  auth,
  isUser,
  userController.deleteAccountImage
);

// Add these routes for Aadhar front and back image upload
router.post(
  "/upload/aadhar-front-image",
  uploadImageAndPdf.single("image"),
  auth,
  isUser,
  userController.uploadAadharFrontImage
);

router.post(
  "/upload/aadhar-back-image",
  uploadImageAndPdf.single("image"),
  auth,
  isUser,
  userController.uploadAadharBackImage
);

// Add logo delete route

// Signature routes
router.post(
  "/upload/signature",
  auth,
  uploadImage.single("image"),
  userController.uploadSignature
);
router.post("/delete/signature", auth, userController.deleteSignature);

router.get("/leave-page/user-data", auth, isUser, userController.leavePageData);
router.post(
  "/leave-page/leave-application",
  auth,
  isUser,
  userController.leaveApplication
);

router.get(
  "/attendance/user-data",
  auth,
  isUser,
  userController.attendanceUserData
);
router.post("/attendance/upload-face", auth, isUser, userController.uploadFace);

router.post("/attendance/check-in", auth, isUser, userController.checkIn);
router.post("/attendance/check-out", auth, isUser, userController.checkOut);


module.exports = router;
