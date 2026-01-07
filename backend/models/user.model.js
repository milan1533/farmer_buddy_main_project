import mongoose from "mongoose";
const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password_hash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['farmer', 'consumer', 'restaurant', 'admin', 'Farmer', 'Consumer', 'Restaurant', 'Admin'],
    required: true
  },
  location: {
    address: String,
    city: String,
    zipCode: String,

  },
  // profilePicture: String,
  phone: String,



}, { timestamps: true });

// For farmers only
userSchema.virtual('farm', {
  ref: 'Farm',
  localField: '_id',
  foreignField: 'owner',
  justOne: true
});

export const User = mongoose.model('User', userSchema);

