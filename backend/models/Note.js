import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  tags: [String],
  bookmarked: { type: Boolean, default: false },
  link: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  label: { type: mongoose.Schema.Types.ObjectId, ref: 'Label', required: true }
});

export default mongoose.model('Note', noteSchema);
