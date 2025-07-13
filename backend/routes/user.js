// routes/user.js
import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
 dotenv.config();


const otpStore = new Map();

const router = express.Router();

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  user.resetCode = code; // ✅ Save OTP to user model
  await user.save();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Reset Your Password',
    text: `Your OTP code is: ${code}`,
  };

  await transporter.sendMail(mailOptions);
  res.json({ message: 'OTP sent to email' });
});

// Reset password via OTP
router.post('/reset-password', async (req, res) => {
  const { email, code, newPassword } = req.body;

  if (!email || !code || !newPassword) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const user = await User.findOne({ email });

  if (!user || user.resetCode !== code) {
    return res.status(400).json({ message: 'Invalid code or email' });
  }

  user.password = newPassword;
  user.resetCode = undefined;
  await user.save();

  res.json({ message: 'Password reset successful' });
});



router.use(protect);

// ✅ Update fullName or username
router.put('/update-profile', async (req, res) => {
  const { fullName, username } = req.body;
  const user = await User.findById(req.user._id);

  if (fullName) user.fullName = fullName;
  if (username) user.username = username;

  await user.save();
  res.json({
    id: user._id,
    fullName: user.fullName,
    username: user.username,
    email: user.email
  });
});

// ✅ Update password
router.put('/update-password', async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Old password is incorrect' });

  user.password = newPassword;
  await user.save();

  res.json({ message: 'Password updated successfully' });
});

 // In-memory store: email -> code

// Send reset OTP to email



export default router;
