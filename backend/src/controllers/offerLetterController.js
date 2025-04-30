exports.respondToOfferLetter = async (req, res) => {
  try {
    const { id } = req.params;
    const { response, signaturePosition } = req.body;
    const userId = req.user.id;

    // Find the offer letter
    const offerLetter = await OfferLetter.findById(id)
      .populate('userId', 'full_Name signature')
      .populate('createdBy', 'full_Name');

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
    offerLetter.status = response;
    offerLetter.employeeSignaturePosition = signaturePosition;
    
    // If accepting, save the user's signature
    if (response === 'accept') {
      // Get the user's signature from their profile
      const user = await User.findById(userId);
      if (!user || !user.signature) {
        return res.status(400).json({ message: 'User signature not found. Please upload your signature in your profile.' });
      }
      
      // Save the signature to the offer letter
      offerLetter.employeeSignature = user.signature;
    }

    // Save the updated offer letter
    await offerLetter.save();

    // Send notification to the creator
    if (offerLetter.createdBy) {
      await Notification.create({
        recipient: offerLetter.createdBy._id,
        type: 'offer_letter_response',
        message: `${offerLetter.userId.full_Name} has ${response}ed the offer letter`,
        relatedDocument: offerLetter._id,
        status: 'unread'
      });
    }

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