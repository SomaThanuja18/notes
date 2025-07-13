import express from 'express';
import Label from '../models/Label.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(protect);

// Fetch labels
router.get('/', async (req, res) => {
  const labels = await Label.find({ user: req.user._id });
  res.json(labels);
});

// Create label
router.post('/', async (req, res) => {
  const label = await Label.create({ name: req.body.name, user: req.user._id });
  res.json(label);
});

// Delete label
router.delete('/:id', async (req, res) => {
  await Label.deleteOne({ _id: req.params.id, user: req.user._id });
  res.json({ message: 'Label deleted' });
});

// Update label (New API)
router.patch('/:id', async (req, res) => {
  const updated = await Label.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { name: req.body.name },
    { new: true }
  );
  res.json(updated);
});

export default router;
