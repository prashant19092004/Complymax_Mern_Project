const OfferLetter = require('../models/OfferLetter');
const Hired = require('../models/hired.model');
const Admin = require('../models/admin.js');
const Hiring = require('../models/hiring.model');
const User = require('../models/user');

// Get all offer letters for the authenticated user
exports.getUserOfferLetters = async (req, res) => {
  try {
    console.log('User ID:', req.user.id);
    
    // Find all offer letters for this user and populate hiring and establishment details
    const offerLetters = await OfferLetter.find({ userId: req.user.id })
      .populate('hiringId')
      .populate({
        path: 'establishmentId',
        select: 'name'
      })
      .sort({ createdAt: -1 });

    console.log('Found Offer Letters:', offerLetters);

    // Transform the data to include job category and company name
    const transformedOfferLetters = offerLetters.map(offer => ({
      ...offer.toObject(),
      jobCategory: offer.hiringId?.jobCategory || 'Not specified',
      companyName: offer.hiringId?.establishmentId?.name || 'Unknown Company'
    }));

    res.json(transformedOfferLetters);
  } catch (error) {
    console.error('Error in getUserOfferLetters:', error);
    res.status(500).json({ message: 'Error fetching offer letters', error: error.message });
  }
};

// Get a specific offer letter by ID
exports.getOfferLetterById = async (req, res) => {
  try {
    const offerLetter = await OfferLetter.findById(req.params.id)
      .populate('hiringId')
      .populate({
        path: 'establishmentId',
        select: 'name'
      })
      .populate({
        path: 'userId',
        select: 'full_Name'
      });

    if (!offerLetter) {
      return res.status(404).json({ message: 'Offer letter not found' });
    }

    // Verify that the offer letter belongs to the authenticated user
    if (offerLetter.userId._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized access to this offer letter' });
    }

    // Transform the data to include job category and company name
    const transformedOfferLetter = {
      ...offerLetter.toObject(),
      position: offerLetter.hiringId?.job_category || 'N/A',
      companyName: offerLetter.establishmentId?.name || 'N/A'
    };

    res.status(200).json(transformedOfferLetter);
  } catch (error) {
    console.error('Error in getOfferLetterById:', error);
    res.status(500).json({ message: 'Error fetching offer letter', error: error.message });
  }
};

// Respond to an offer letter (accept/reject)
exports.respondToOfferLetter = async (req, res) => {
  try {
    const { id } = req.params;
    const { response, signaturePosition } = req.body;
    const userId = req.user.id;

    // Find the offer letter
    const offerLetter = await OfferLetter.findById(id)
      .populate('userId', 'signature');

    if (!offerLetter) {
      return res.status(404).json({ message: 'Offer letter not found' });
    }

    // Check if the offer letter belongs to the user
    if (offerLetter.userId._id.toString() !== userId) {
      return res.status(403).json({ message: 'You are not authorized to respond to this offer letter' });
    }

    // Check if the offer letter is already responded
    if (offerLetter.status !== 'sent') {
      return res.status(400).json({ message: 'This offer letter has already been responded to' });
    }

    // Update the offer letter status and signature position
    offerLetter.status = response === 'accept' ? 'accepted' : 'rejected';
    offerLetter.documentStyle.employeeSignaturePosition = signaturePosition;
    
    // If accepting, save the user's signature
    if (response === 'accept') {
      // Get the user's signature from their profile
      const user = await User.findById(userId);
      if (!user || !user.signature) {
        return res.status(400).json({ message: 'User signature not found. Please upload your signature in your profile.' });
      }
      
      // Save the signature to the offer letter
      offerLetter.assets.employeeSignature = user.signature;
    }

    // Save the updated offer letter
    await offerLetter.save();

    res.json({
      message: `Offer letter ${response}ed successfully`,
      offerLetter: {
        _id: offerLetter._id,
        status: offerLetter.status,
        employeeSignaturePosition: offerLetter.employeeSignaturePosition,
        employeeSignature: offerLetter.employeeSignature
      }
    });
  } catch (error) {
    console.error('Error responding to offer letter:', error);
    res.status(500).json({ message: 'Failed to respond to offer letter', error: error.message });
  }
}; 