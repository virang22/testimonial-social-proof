import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
  space: { type: mongoose.Schema.Types.ObjectId, ref: 'Space', required: true },
  clientName: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  companyRole: { type: String, required: true, trim: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  reviewText: { type: String, required: true, trim: true },
  avatar: String,
  status: { type: String, enum: ['Pending', 'Approved', 'Archived'], default: 'Pending' },
  isFeatured: { type: Boolean, default: false },
  isLiked: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Testimonial', testimonialSchema);
