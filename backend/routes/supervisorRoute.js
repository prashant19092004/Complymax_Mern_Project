const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const userModel = require('../models/user');
const clientModel = require('../models/client.model');
const supervisorModel = require('../models/supervisor.model');

// Test route to verify router is working
router.get('/test', (req, res) => {
    res.json({ message: 'Supervisor routes working' });
});

// Get all employees for offer letters
router.get('/offer-letters', auth, async (req, res) => {
    try {
        const currentSupervisor = await supervisorModel.findOne({ email: req.user.email });
        if (!currentSupervisor) {
            return res.status(404).json({
                success: false,
                message: 'Supervisor not found'
            });
        }

        const users = await userModel.find({
            active_user_status: true
        }).populate('hired');

        const activeUsers = users.filter(user => 
            user.hired && user.hired.establishment_id && 
            user.hired.establishment_id.equals(currentSupervisor.establisment)
        );

        res.status(200).json({
            success: true,
            employees: activeUsers,
            message: 'Employees list fetched successfully'
        });

    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching employees'
        });
    }
});

// Add this route to get employee details
router.get('/employee/:id', auth, async (req, res) => {
    try {
        const employee = await userModel.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }
        res.json({
            success: true,
            employee
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching employee details'
        });
    }
});




module.exports = router;