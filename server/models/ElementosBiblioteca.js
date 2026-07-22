import mongoose from 'mongoose';

const libraryItemSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  libro: { type: mongoose.Schema.Types.ObjectId, ref: 'Libro', required: true },
  tipoCompra: { type: String, enum: ['subscription', 'permanent'], default: 'subscription' },
}, { timestamps: true });

libraryItemSchema.index({ usuario: 1, libro: 1 }, { unique: true });

export default mongoose.model('ElementoBiblioteca', libraryItemSchema, 'biblioteca_usuario');
