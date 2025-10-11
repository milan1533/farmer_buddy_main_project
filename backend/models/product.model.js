import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  farm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['vegetables', 'fruits', 'dairy', 'meat', 'poultry', 'grains', 'herbs', 'other'],
    required: true
  },
  description: String,
  price: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    enum: ['kg', 'lb', 'piece', 'dozen', 'bunch', 'liter', 'gallon', 'box'],
    required: true
  },
  availableQuantity: {
    type: Number,
    required: true,
    min: 0
  },
  images: [String],
  organic: {
    type: Boolean,
    default: false
  },
  harvestDate: Date,
  rating: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  tags: [String],
  isSubscriptionAvailable: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export const Product = mongoose.model('Product', productSchema);
