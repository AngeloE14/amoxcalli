import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String, required: true },
  coverUrl: { type: String, default: '' },
  genre: { type: String, required: true },
  language: { type: String, default: 'Español' },
  price: { type: Number, default: 9.99 },
  pages: { type: Number, default: 0 },
  content: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('Book', bookSchema);
