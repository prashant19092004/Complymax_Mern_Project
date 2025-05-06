const User = require('../models/user');
const fs = require('fs');
const path = require('path');

// Upload signature
exports.uploadSignature = async (req, res) => {
  try {
    // console.log('Upload request received:', req.file);

    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No signature file provided' 
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      if (req.file.path) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Delete old signature if exists
    if (user.signature) {
      const oldPath = path.join(__dirname, '..', 'uploads', user.signature);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    // Store just the filename with /uploads prefix
    user.signature = `/uploads/${req.file.filename}`;
    await user.save();

    res.json({
      success: true,
      message: 'Signature uploaded successfully',
      user: {
        ...user.toObject(),
        signature: `/uploads/${req.file.filename}`
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error uploading signature'
    });
  }
};

// Delete signature
exports.deleteSignature = async (req, res) => {
  try {
    // console.log('Delete request received for user:', req.user.id);

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    if (user.signature) {
      const signaturePath = path.join(__dirname, '..', 'uploads', user.signature.replace('/uploads/', ''));
      // console.log('Attempting to delete file at:', signaturePath);
      
      try {
        if (fs.existsSync(signaturePath)) {
          fs.unlinkSync(signaturePath);
          // console.log('File deleted successfully');
        }
      } catch (fileError) {
        console.error('Error deleting file:', fileError);
        // Continue even if file deletion fails
      }

      // Update database
      user.signature = '';
      await user.save();
      // console.log('Database updated successfully');

      res.json({ 
        success: true, 
        message: 'Signature deleted successfully',
        user: user.toObject()
      });
    } else {
      res.json({ 
        success: true, 
        message: 'No signature found to delete',
        user: user.toObject()
      });
    }
  } catch (error) {
    console.error('Error in deleteSignature:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting signature',
      error: error.message 
    });
  }
};