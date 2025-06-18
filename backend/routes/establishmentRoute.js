const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const userModel = require('../models/user');
const clientModel = require('../models/client.model');
const establishmentModel = require('../models/admin.js');
const supervisorModel = require('../models/supervisor.model');
const { uploadImage } = require('../middleware/multer.js');
const establishmentController = require('../controllers/establishmentController');
const path = require('path');
const fs = require('fs');
const { isEstablishment } = require('../middleware/auth');


// Test route to verify router is working
router.get('/test', (req, res) => {
    res.json({ message: 'Establishment routes working' });
});

// @desc    Get establishment profile for offer letter
// @route   GET /api/establishment/profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
    try {
        const currentSupervisor = await supervisorModel.findById(req.user.id);
        const establishment = await establishmentModel.findById(currentSupervisor.establisment)
            .select('_id name email phone address logo signature');

        if (!establishment) {
            return res.status(404).json({
                success: false,
                message: 'Establishment not found'
            });
        }

        // Make sure all required fields are included in the response
        res.status(200).json({
            success: true,
            data: {
                _id: establishment._id,
                name: establishment.name,
                email: establishment.email,
                phone: establishment.phone,
                address: establishment.address,
                logo: establishment.logo,
                signature: establishment.signature,
                // Add any other fields you need
            }
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching establishment profile',
            error: error.message
        });
    }
});

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
router.delete('/delete-signature', auth, async (req, res) => {
    try {
        const establishment = await establishmentModel.findById(req.user.id);
        if (!establishment) {
            return res.status(404).json({
                success: false,
                message: 'Establishment not found'
            });
        }

        if (establishment.signature) {
            const signaturePath = path.join(__dirname, '..', 'uploads', establishment.signature);
            if (fs.existsSync(signaturePath)) {
                fs.unlinkSync(signaturePath);
            }
            establishment.signature = null;
            await establishment.save();
        }

        res.json({
            success: true,
            message: 'Signature deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting signature:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete signature'
        });
    }
});


router.get('/leave-page/leave-requests', auth, isEstablishment, establishmentController.getLeaveRequests);
router.post('/leave-page/allot-leave', auth, isEstablishment, establishmentController.allotLeave);
router.post('/leave-page/leave-response/:id', auth, isEstablishment, establishmentController.updateLeaveStatus);


module.exports = router;