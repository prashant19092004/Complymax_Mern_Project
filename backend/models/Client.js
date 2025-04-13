const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  offerLetters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OfferLetter'
  }]
});

const Client = mongoose.model('Client', clientSchema);

module.exports = Client; 