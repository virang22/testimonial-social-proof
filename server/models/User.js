import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name:                    { type: String, required: true, trim: true },
  email:                   { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:                { type: String, required: true, select: false },

  // Email verification
  isVerified:              { type: Boolean, default: false },
  emailVerificationCode:   { type: String, select: false },
  verificationExpires:     { type: Date },

  // Refresh-token rotation — store a hash + version so old tokens are instantly invalid
  refreshTokenHash:        { type: String, select: false },
  tokenVersion:            { type: Number, default: 0 },

  // Password reset
  resetTokenHash:          { type: String, select: false },
  resetTokenExpires:       { type: Date },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
