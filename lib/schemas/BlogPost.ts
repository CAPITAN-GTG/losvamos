import mongoose from 'mongoose';

const BlogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  heroImage: { type: String, required: true },
  author: { type: String, required: true },
  tags: [{ type: String }],
  isPublished: { type: Boolean, default: false },
  publishedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Check if model already exists, if not create it
const BlogPost = (mongoose.models && mongoose.models.BlogPost) || mongoose.model('BlogPost', BlogPostSchema, 'blogposts');

export default BlogPost;
