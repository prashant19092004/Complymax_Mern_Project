const express = require('express');
const router = express.Router();
const offerLetterController = require('../controllers/offerLetterController');
const auth = require('../middleware/auth');

// ... existing routes ...

// User routes
router.get('/user/offer-letters', auth, offerLetterController.getUserOfferLetters);
router.get('/user/offer-letter/:id', auth, offerLetterController.getUserOfferLetter);
router.put('/user/accept/:id', auth, offerLetterController.acceptOfferLetter);
router.put('/user/reject/:id', auth, offerLetterController.rejectOfferLetter);

module.exports = router; 