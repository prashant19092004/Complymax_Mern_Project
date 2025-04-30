const mongoose = require('mongoose');

const offerLetterSchema = new mongoose.Schema({
  // ... existing code ...
  
  status: {
    type: String,
    enum: ['sent', 'accepted', 'rejected'],
    default: 'sent'
  },
  
  employeeSignature: {
    type: String,
    default: null
  },
  
  employeeSignaturePosition: {
    x: {
      type: Number,
      default: 0
    },
    y: {
      type: Number,
      default: 0
    }
  },
  
  // ... rest of the existing code ...
});

module.exports = mongoose.model('OfferLetter', offerLetterSchema); 