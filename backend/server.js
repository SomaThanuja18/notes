import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import labelRoutes from './routes/labels.js';
import noteRoutes from './routes/notes.js';
import userRoutes from './routes/user.js';



const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/labels', labelRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/user', userRoutes);

// Direct MongoDB URI here (no .env)
mongoose.connect('mongodb://localhost:27017/thanuja-notes-app')
  .then(() => {
    app.listen(5000, () => {
      console.log(' Backend running on http://localhost:5000');
    });
  })
  .catch((err) => {
    console.error(' Failed to connect to MongoDB:', err.message);
  });
