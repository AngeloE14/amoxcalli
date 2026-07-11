import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['subscription', 'purchase'], required: true },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  transactionId: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Transaction', transactionSchema);
