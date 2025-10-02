import mongoose from 'mongoose';

const PlaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String },
  location: { type: String, required: true },
  address: { type: String },
  heroImage: { type: String, required: true },
  gallery: [{ type: String }],
  category: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5 },
  priceRange: { type: String, enum: ['$', '$$', '$$$', '$$$$'] },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  amenities: [{ type: String }],
  tags: [{ type: String }],
  date: { type: String },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Check if model already exists, if not create it
const Place = (mongoose.models && mongoose.models.Place) || mongoose.model('Place', PlaceSchema, 'places');

export default Place;
