const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const userModel = require('../models/user');
const clientModel = require('../models/client.model');
const supervisorModel = require('../models/supervisor.model');
const supervisorController = require('../controllers/supervisorController');
const { isSupervisor } = require('../middleware/auth');
const { uploadPDF } = require("../middleware/multer.js");

// Test route to verify router is working
router.get('/test', (req, res) => {
    res.json({ message: 'Supervisor routes working' });
});

router.get("/hirings", auth, isSupervisor, supervisorController.getHirings);

router.post("/hire", auth, isSupervisor, supervisorController.hireUser);

router.get("/dashboard",auth, isSupervisor, supervisorController.getSupervisorDashboard);

router.get("/active-users", auth, isSupervisor, supervisorController.getActiveUsers);

router.post('/assign-date-of-joining', auth, isSupervisor, supervisorController.assignDateOfJoining);

router.get('/hired', auth, isSupervisor, supervisorController.getHiredUsers);

router.get('/pending-wages', auth, isSupervisor, supervisorController.getPendingWages);

router.post('/save-wages', auth, isSupervisor, supervisorController.saveWages);


// Get all employees for offer letters
router.get('/offer-letters', auth, isSupervisor, supervisorController.getOfferLetters);

// Add this route to get employee details
router.get('/employee/:id', auth, isSupervisor, supervisorController.getEmployeeDetails);

router.get('/establishment/profile', auth, isSupervisor, supervisorController.getEstablishmentProfile);

router.get('/pending-pf-esic', auth, isSupervisor, supervisorController.getPendingPfEsic);

router.post('/save-pf-esic', auth, isSupervisor, supervisorController.savePfEsic);

router.post('/upload/file1', uploadPDF.single('file1'), auth, isSupervisor, supervisorController.uploadFile1);

router.post('/upload/file2', uploadPDF.single('file2'), auth, isSupervisor, supervisorController.uploadFile2);

router.get('/profile', auth, isSupervisor, supervisorController.getSupervisorProfile);


router.get('/users', auth, isSupervisor, supervisorController.getUsers);

router.post('/leave-page/leave-response/:id', auth, isSupervisor, supervisorController.updateLeaveStatus);
router.get('/leave-page/leave-requests', auth, isSupervisor, supervisorController.getLeaveRequests);

router.post('/add-reporting-location', auth, isSupervisor, supervisorController.addReportingLocation); 

router.post('/save-checkin-checkout', auth, isSupervisor, supervisorController.saveCheckInCheckOut);

module.exports = router;