import mongoose from 'mongoose';

const PlaceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  date: { type: String, required: true },
  heroImage: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  gallery: [{ type: String }],
  pins: [{ type: String }], // Array of user IDs who pinned this place
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Check if model already exists, if not create it
const Place = (mongoose.models && mongoose.models.Place) || mongoose.model('Place', PlaceSchema, 'places');

export default Place;
