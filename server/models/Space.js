import mongoose from 'mongoose';

const spaceSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  logo: String,
  prompt: { type: String, default: "What's on your mind?" },
  allowAvatar: { type: Boolean, default: true },
  allowRating: { type: Boolean, default: true },
  customQuestions: { type: [String], default: [] }
}, { timestamps: true });

export default mongoose.model('Space', spaceSchema);
