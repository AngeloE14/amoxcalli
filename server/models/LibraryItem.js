import mongoose from 'mongoose';

const libraryItemSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  purchaseType: { type: String, enum: ['subscription', 'permanent'], default: 'subscription' },
}, { timestamps: true });

libraryItemSchema.index({ user: 1, book: 1 }, { unique: true });

export default mongoose.model('LibraryItem', libraryItemSchema);
