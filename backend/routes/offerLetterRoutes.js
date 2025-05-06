const express = require('express');
const router = express.Router();
const OfferLetter = require('../models/OfferLetter');
const User = require('../models/user');
const Hired = require('../models/hired.model');
const Establishment = require('../models/admin');
const Supervisor = require('../models/supervisor.model');
const Hiring = require('../models/hiring.model');
const {auth} = require('../middleware/auth');
const offerLetterController = require('../controllers/offerLetterController');

router.get('/:id', auth, async function(req, res){
    try{
        

        const supervisorId = req.user.id;
        const hiredId = req.params.id;

        let offerLetter = await OfferLetter.findOne({
            supervisorId,
            hiredId
        });

        res.status(200).json({
            message : "status checked",
            offerLetter
        })
    } catch (error) {
        console.error('Error in checking status :', error);
        res.status(500).json({
            success: false,
            message: 'Failed to check the status',
            error: error.message
        });
    }
})

router.post('/send', auth, async function(req, res) {
    // console.log('Received offer letter data:', JSON.stringify(req.body, null, 2));
    try {
        // Validate required fields
        const requiredFields = [
            'establishmentId',
            'userId',
            'hiredId',
            'hiringId'
        ];

        const missingFields = requiredFields.filter(field => {
            const value = field.split('.').reduce((obj, key) => obj && obj[key], req.body);
            return !value;
        });

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields',
                missingFields: missingFields
            });
        }

        // Get supervisor ID from the authenticated user's token
        const supervisorId = req.user.id;

        // Check if an offer letter already exists for this user and hiring
        let offerLetter = await OfferLetter.findOne({
            userId: req.body.userId,
            hiringId: req.body.hiringId,
            establishmentId: req.body.establishmentId
        });

        // Prepare the letter content with all edited data
        const letterContent = {
            ...req.body.letterContent,
            employeeInfo: {
                ...req.body.letterContent?.employeeInfo,
                name: req.body.letterContent?.recipient?.name || '',
                address: req.body.letterContent?.recipient?.address || '',
                date: req.body.letterContent?.recipient?.date || ''
            },
            companyInfo: {
                ...req.body.letterContent?.header,
                name: req.body.letterContent?.header?.companyName || '',
                address: req.body.letterContent?.header?.address || '',
                email: req.body.letterContent?.header?.email || '',
                phone: req.body.letterContent?.header?.phone || ''
            },
            status: req.body.status || 'pending'
        };

        console.log('Processed letter content:', JSON.stringify(letterContent, null, 2));

        if (offerLetter) {
            // Update existing offer letter
            offerLetter = await OfferLetter.findByIdAndUpdate(
                offerLetter._id,
                {
                    ...req.body,
                    supervisorId: supervisorId,
                    letterContent: letterContent
                },
                { new: true }
            );

            // console.log('Updated offer letter:', JSON.stringify(offerLetter, null, 2));

            // Update Hired document status
            await Hired.findByIdAndUpdate(
                req.body.hiredId,
                { 
                    $set: { 
                        offerLetterStatus: 'offer_sent'
                    }
                },
                { new: true }
            );

            return res.status(200).json({
                success: true,
                message: 'Offer letter updated successfully',
                data: offerLetter
            });
        }

        // Create new offer letter instance if none exists
        offerLetter = new OfferLetter({
            ...req.body,
            supervisorId: supervisorId,
            letterContent: letterContent
        });
        
        // Save the offer letter first to get its ID
        await offerLetter.save();

        // console.log('Created new offer letter:', JSON.stringify(offerLetter, null, 2));

        // Update all related documents with the offer letter ID
        const updatePromises = [
            // Update User document
            User.findByIdAndUpdate(
                req.body.userId,
                { 
                    $push: { 
                        offerLetters: offerLetter._id 
                    }
                },
                { new: true }
            ),

            // Update Hired document
            Hired.findByIdAndUpdate(
                req.body.hiredId,
                { 
                    $set: { 
                        offerLetterId: offerLetter._id,
                        offerLetterStatus: 'offer_sent'
                    }
                },
                { new: true }
            ),

            // Update Client document
            Hiring.findByIdAndUpdate(
                req.body.hiringId,
                { 
                    $push: { 
                        offerLetters: offerLetter._id 
                    }
                },
                { new: true }
            ),

            // Update Establishment document
            Establishment.findByIdAndUpdate(
                req.body.establishmentId,
                { 
                    $push: { 
                        offerLetters: offerLetter._id 
                    }
                },
                { new: true }
            ),

            // Update Supervisor's document (using supervisorId from token)
            Supervisor.findByIdAndUpdate(
                supervisorId,
                { 
                    $push: { 
                        sentOfferLetters: offerLetter._id 
                    }
                },
                { new: true }
            )
        ];

        // Execute all updates concurrently
        await Promise.all(updatePromises);

        res.status(201).json({
            success: true,
            message: 'Offer letter sent successfully and all references updated',
            data: offerLetter
        });
    } catch (error) {
        console.error('Error in sending offer letter:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send offer letter',
            error: error.message
        });
    }
});

// Get all offer letters for an establishment
router.get('/establishment/:establishmentId', auth, async function(req, res) {
    try {
        const offerLetters = await OfferLetter.find({
            establishmentId: req.params.establishmentId
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: offerLetters
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch offer letters',
            error: error.message
        });
    }
});

// Get all offer letters for a user
router.get('/user/offer-letters', auth, offerLetterController.getUserOfferLetters);

// Get a specific offer letter
router.get('/user/offer-letter/:id', auth, offerLetterController.getOfferLetterById);

// Accept or reject an offer letter
router.post('/user/offer-letter/:id/respond', auth, offerLetterController.respondToOfferLetter);

module.exports = router; 