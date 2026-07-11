import mongoose from 'mongoose';

const planSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  durationDays: { type: Number, required: true },
  maxBooks: { type: Number, default: null },
  description: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Plan', planSchema);
