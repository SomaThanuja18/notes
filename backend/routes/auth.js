import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const router = express.Router();
const JWT_SECRET = 'myHardcodedJWTSecretKey';  // Hardcoded secret (NO .env)

router.post('/register', async (req, res) => {
  try {
    console.log('Request body:', req.body); // ✅ log incoming request

    const { fullName, username, email, password } = req.body;

    if (!fullName || !username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({ fullName, username, email, password });

    const token = jwt.sign({ id: user._id },JWT_SECRET);
    res.json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Registration error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user._id }, JWT_SECRET);
  res.json({ 
    token, 
    user: { 
      id: user._id, 
      fullName: user.fullName, 
      email: user.email, 
      username: user.username 
    } 
  });
});


export default router;
