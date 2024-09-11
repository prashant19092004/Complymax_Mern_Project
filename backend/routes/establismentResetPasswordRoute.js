const express = require("express")
const router = express.Router();
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const userModel = require('../models/user.js');
const establismentModel = require('../models/admin.js');

const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email provider
    auth: {
      user: 'pk62066045@gmail.com',
      pass: 'Pk@6206604163',
    },
  });

router.post('/', async (req, res) => {
    const { email } = req.body;
  
    // Find user by email
    const establisment = await establismentModel.findOne({ email });
  
    if (!establisment) {
      return res.status(404).json({ message: 'Email not found' });
    }
  
    // Generate password reset token and expiration
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
  
    establisment.resetPasswordToken = resetTokenHash; // Store hashed token in DB
    establisment.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes expiration
    await establisment.save();
  
    // Send password reset link via email
    const resetLink = `http://localhost:9000/api/reset-password/${resetToken}`;
    const mailOptions = {
      from: 'pk62066045@gmail.com',
      to: establisment.email,
      subject: 'Password Reset Link',
      text: `You requested a password reset. Click on the following link to reset your password: ${resetLink}`,
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: 'Error sending email' });
      } else {
        res.status(200).json({ message: 'Password reset link sent to your email' });
      }
    });
  }
);


router.post('/:token', async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  // Hash the token to match the one stored in the database
  const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

  // Find the user with the matching reset token and make sure it hasn't expired
  const establisment = await establismentModel.findOne({
    resetPasswordToken: resetTokenHash,
    resetPasswordExpires: { $gt: Date.now() }, // Token must not be expired
  });

  if (!establisment) {
    return res.status(400).json({ message: 'Invalid or expired token' });
  }

  // Hash the new password and save it
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  // Update user's password and clear the reset token fields
  establisment.password = hashedPassword;
  establisment.resetPasswordToken = undefined;
  establisment.resetPasswordExpires = undefined;
  await establisment.save();

  res.status(200).json({ message: 'Password has been reset successfully' });
}
);

router.get('/hello', (req, res) => {
    res.send('Hiii')
});




module.exports = router;