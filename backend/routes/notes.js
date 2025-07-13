import express from 'express';
import Note from '../models/Note.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(protect);

router.get('/label/:labelId', async (req, res) => {
  const notes = await Note.find({ user: req.user._id, label: req.params.labelId });
  res.json(notes);
});

router.post('/label/:labelId', async (req, res) => {
  const note = await Note.create({
    name: req.body.name,
    description: req.body.description,
    tags: req.body.tags,
    bookmarked: req.body.bookmarked,
    link: req.body.link,
    label: req.params.labelId,
    user: req.user._id
  });
  res.json(note);
});

router.delete('/:id', async (req, res) => {
  await Note.deleteOne({ _id: req.params.id, user: req.user._id });
  res.json({ message: 'Note deleted' });
});

router.patch('/:id/tags', async (req, res) => {
  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { $addToSet: { tags: { $each: req.body.tags } } },
    { new: true }
  );
  res.json(note);
});
// Fetch all bookmarked notes for current user
router.get('/bookmarked', async (req, res) => {
  const notes = await Note.find({ user: req.user._id, bookmarked: true }).populate('label','name');
  res.json(notes);
});

// Update full note details
router.patch('/:id', async (req, res) => {
  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    {
      name: req.body.name,
      description: req.body.description,
      tags: req.body.tags,
      link: req.body.link,
    },
    { new: true }
  );
  res.json(note);
});

router.get('/search', async (req, res) => {
  const { tag } = req.query;
  if (!tag) {
    return res.status(400).json({ message: 'Tag query is required' });
  }
  const notes = await Note.find({
    user: req.user._id,
    tags: { $regex: tag, $options: 'i' },  // Case-insensitive search
  });
  res.json(notes);
});


router.patch('/:id/bookmark', async (req, res) => {
  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { bookmarked: req.body.bookmarked },
    { new: true }
  );
  res.json(note);
});

export default router;
