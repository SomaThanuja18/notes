import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();


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
// mongoose.connect(process.env.MONGOURI)
//   .then(() => {
//     app.listen(process.env.PORT || 5000, () => {
//       console.log(`Backend running on http://localhost:${process.env.PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error('Failed to connect to MongoDB:', err.message);
//   });


  const connectToDatabase = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://babunkundu60:0EEN18UaPa93Fk91@stminorg27.plp450e.mongodb.net/thanuja-notes-app?retryWrites=true&w=majority&appName=stminorg27'
    );
    console.log('Connected to MongoDB');

  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message);
  }
};

connectToDatabase();

    app.listen(5000, () => {
      console.log('Backend running on http://localhost:5000');
    });
