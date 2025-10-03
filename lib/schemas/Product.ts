import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  longDescription: { type: String },
  price: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'USD' },
  images: [{ type: String, required: true }],
  category: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0 },
  inStock: { type: Boolean, default: true },
  tags: [{
    type: { type: String, required: true },
    value: { type: String, required: true },
    label: { type: String }
  }],
  sizes: [{ type: String }],
  colors: [{ type: String }],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Check if model already exists, if not create it
const Product = (mongoose.models && mongoose.models.Product) || mongoose.model('Product', ProductSchema, 'products');

export default Product;
