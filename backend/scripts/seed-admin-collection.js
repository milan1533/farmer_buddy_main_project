// backend/scripts/seed-admin-collection.js
// One-time utility to create or update an admin account in the NEW `admin` collection.
// It connects to MongoDB using MONGO_URL from your backend .env, hashes the password, and upserts the admin.

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/farmer-buddy';

// Define a dedicated Admin schema that writes to the `admin` collection
const AdminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password_hash: { type: String, required: true },
    // Keep role for clarity; for admin collection it's always 'admin'
    role: { type: String, default: 'admin' },
    phone: String,
    location: {
      address: String,
      city: String,
      zipCode: String,
    },
  },
  { timestamps: true, collection: 'admin' }
);

// Ensure unique index on email
AdminSchema.index({ email: 1 }, { unique: true });

const AdminModel = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

async function upsertAdmin({ name, email, password, phone, address, city, zipCode }) {
  await mongoose.connect(MONGO_URL);
  console.log('Connected to Mongo at', MONGO_URL);

  const password_hash = await bcrypt.hash(password, 10);

  const res = await AdminModel.updateOne(
    { email: email.toLowerCase().trim() },
    {
      $setOnInsert: {
        name,
        email: email.toLowerCase().trim(),
        password_hash,
        role: 'admin',
        phone: phone || '',
        location: { address: address || '', city: city || '', zipCode: zipCode || '' },
      },
    },
    { upsert: true }
  );

  console.log('Upsert result:', res);
  await mongoose.disconnect();
  console.log('Done.');
}

// Edit these values or pass via env for quick testing
const input = {
  name: process.env.SEED_ADMIN_NAME || 'Admin User',
  email: process.env.SEED_ADMIN_EMAIL || 'admin@example.com',
  password: process.env.SEED_ADMIN_PASSWORD || 'StrongPass123!',
  phone: process.env.SEED_ADMIN_PHONE || '0000000000',
  address: process.env.SEED_ADMIN_ADDRESS || 'HQ',
  city: process.env.SEED_ADMIN_CITY || 'YourCity',
  zipCode: process.env.SEED_ADMIN_ZIP || '12345',
};

upsertAdmin(input).catch((err) => {
  console.error(err);
  process.exit(1);
});
