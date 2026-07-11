import mongoose from 'mongoose';

const wishlistItemSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
}, { timestamps: true });

wishlistItemSchema.index({ user: 1, book: 1 }, { unique: true });

export default mongoose.model('WishlistItem', wishlistItemSchema);
