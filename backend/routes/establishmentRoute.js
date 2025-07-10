const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const userModel = require('../models/user');
const clientModel = require('../models/client.model');
const establishmentModel = require('../models/admin.js');
const supervisorModel = require('../models/supervisor.model');
const { uploadImage } = require('../middleware/multer.js');
const { uploadPDF } = require("../middleware/multer.js");
const establishmentController = require('../controllers/establishmentController');
const path = require('path');
const fs = require('fs');
const { isEstablishment } = require('../middleware/auth');


// Test route to verify router is working
router.get('/test', (req, res) => {
    res.json({ message: 'Establishment routes working' });
});

router.get("/dashboard",auth, isEstablishment, establishmentController.dashboardData);

router.get("/profile",auth, isEstablishment, establishmentController.getEstablishmentProfile);


router.post("/client_data", establishmentController.getClientData);

router.post("/delete_location", auth, isEstablishment, establishmentController.deleteLocation);

router.post("/add_location", auth, isEstablishment, establishmentController.addLocation);

router.get("/hirings", auth, isEstablishment, establishmentController.getHirings);

router.get("/clientlist",auth, isEstablishment, establishmentController.getClientList);

router.post("/client_edit", auth, isEstablishment, establishmentController.editClient);

router.post("/hiring_post", auth, isEstablishment, establishmentController.postHiring);

router.post("/supervisor_data", establishmentController.getSupervisorData);

router.get("/supervisorlist",auth, isEstablishment, establishmentController.getSupervisorList);

router.post("/supervisor_edit", auth, isEstablishment, establishmentController.editSupervisor);

router.post("/user_profile/add_Account",auth, isEstablishment, establishmentController.addUserAccount);

router.get('/active-users', auth, isEstablishment, establishmentController.getActiveUsers);

router.get('/pending-wages', auth, isEstablishment, establishmentController.getPendingWages);

router.post('/save-wages', auth, isEstablishment, establishmentController.saveWages);

router.post('/employee-detail', auth, isEstablishment, establishmentController.getEmployeeDetail);

router.post("/user_profile/add_Pan",auth, isEstablishment, establishmentController.addUserPan);

router.get('/pending-pf-esic', auth, isEstablishment, establishmentController.getPendingPfEsic);

router.post('/save-pf-esic', auth, isEstablishment, establishmentController.savePfEsic);

router.post('/upload/file1', uploadPDF.single('file1'), auth, isEstablishment, establishmentController.uploadFile1);

router.post('/upload/file2', uploadPDF.single('file2'), auth, isEstablishment, establishmentController.uploadFile2);

router.post('/upload-profile-pic', uploadImage.single('image'), auth, isEstablishment, establishmentController.uploadProfilePic);

// Add this route for establishment profile update
    router.post('/update-profile', auth, isEstablishment, establishmentController.updateProfile);

    // Add logo upload route
        router.post('/upload-logo', uploadImage.single('logo'), auth, isEstablishment, establishmentController.uploadLogo);

router.post('/delete-logo', auth, isEstablishment, establishmentController.deleteLogo);

router.post('/register-user', auth, isEstablishment, establishmentController.registerUser);

router.get('/users', auth, isEstablishment, establishmentController.getUsers);




// @desc    Get employee details for offer letter
// @route   GET /api/establishment/employee/:employeeId
// @access  Private
router.get('/employee/:employeeId', auth, async (req, res) => {
    try {
        const employee = await clientModel.findById(req.params.employeeId)
            .select('full_Name address email phone');

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        res.status(200).json({
            success: true,
            employee
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching employee details',
            error: error.message
        });
    }
});

// @desc    Generate offer letter
// @route   POST /api/establishment/offer-letter
// @access  Private
router.post('/offer-letter', auth, async (req, res) => {
    try {
        const {
            employeeId,
            position,
            salary,
            incentive,
            reportingTo,
            supervisor,
            workingHours,
            startDay,
            endDay,
            joiningDate,
            joiningTime,
            reportingPerson,
            acceptanceDate
        } = req.body;

        // Validate required fields
        if (!employeeId || !position || !salary || !joiningDate) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Check if employee exists
        const employee = await clientModel.findById(employeeId);
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        // Create offer letter record (if you have a model for it)
        const offerLetter = {
            employeeId,
            position,
            salary,
            incentive,
            reportingTo,
            supervisor,
            workingHours,
            startDay,
            endDay,
            joiningDate,
            joiningTime,
            reportingPerson,
            acceptanceDate,
            establishment: req.user.establishment,
            status: 'pending',
            createdAt: new Date()
        };

        // You might want to save this to a database
        // const savedOfferLetter = await OfferLetterModel.create(offerLetter);

        res.status(200).json({
            success: true,
            message: 'Offer letter generated successfully',
            data: offerLetter
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error generating offer letter',
            error: error.message
        });
    }
});

// @desc    Update offer letter status
// @route   PUT /api/establishment/offer-letter/:id
// @access  Private
router.put('/offer-letter/:id', auth, async (req, res) => {
    try {
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'Please provide status'
            });
        }

        // Update offer letter status in database if you have a model for it
        // const updatedOfferLetter = await OfferLetterModel.findByIdAndUpdate(
        //     req.params.id,
        //     { status },
        //     { new: true }
        // );

        res.status(200).json({
            success: true,
            message: 'Offer letter status updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating offer letter status',
            error: error.message
        });
    }
});

router.post('/upload-signature', auth, uploadImage.single('signature'), establishmentController.uploadSignature);
router.delete('/delete-signature', auth, isEstablishment, establishmentController.deleteSignature);



router.get('/leave-page/leave-requests', auth, isEstablishment, establishmentController.getLeaveRequests);
router.post('/leave-page/allot-leave', auth, isEstablishment, establishmentController.allotLeave);
router.post('/leave-page/leave-response/:id', auth, isEstablishment, establishmentController.updateLeaveStatus);


router.get('/attendance/records', auth, isEstablishment, establishmentController.getAttendanceRecords);
router.get('/attendance/employee-record/:id', auth, isEstablishment, establishmentController.getEmployeeAttendanceRecord);

router.get('/holiday-management/get-data', auth, isEstablishment, establishmentController.getHolidayData);


module.exports = router;