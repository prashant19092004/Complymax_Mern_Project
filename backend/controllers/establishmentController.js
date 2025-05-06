const Admin = require('../models/admin');
const fs = require('fs');
const path = require('path');

const uploadSignature = async (req, res) => {
  try {
    // console.log('Upload request received:', req.file);

    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No signature file provided' 
      });
    }

    const admin = await Admin.findById(req.user.id);
    if (!admin) {
      if (req.file.path) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ 
        success: false, 
        message: 'Admin not found' 
      });
    }

    // Delete old signature if exists
    if (admin.signature) {
      const oldPath = path.join(__dirname, '..', 'uploads', admin.signature);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    // Store just the filename
    admin.signature = req.file.filename;
    await admin.save();

    res.json({
      success: true,
      message: 'Signature uploaded successfully',
      signature: '/uploads/' + req.file.filename
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

const deleteSignature = async (req, res) => {
  try {
    // console.log('Delete request received for user:', req.user.id);

    // Find the establishment
    const establishment = await Admin.findById(req.user.id);
    if (!establishment) {
      // console.log('Establishment not found');
      return res.status(404).json({ 
        success: false, 
        message: 'Establishment not found' 
      });
    }

    if (establishment.signature) {
      const signaturePath = path.join(__dirname, '..', 'uploads', establishment.signature);
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
      establishment.signature = null;
      await establishment.save();
      // console.log('Database updated successfully');

      res.json({ 
        success: true, 
        message: 'Signature deleted successfully' 
      });
    } else {
      res.json({ 
        success: true, 
        message: 'No signature found to delete' 
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

module.exports = {
  uploadSignature,
  deleteSignature
}; 