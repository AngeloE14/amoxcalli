
import mongoose from 'mongoose';

const libraryItemSchema = new mongoose.Schema({
  // Referencia al modelo 'Usuario': vincula el elemento con un usuario
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  // Referencia al modelo 'Libro': vincula el elemento con un libro
  libro: { type: mongoose.Schema.Types.ObjectId, ref: 'Libro', required: true },
  // Tipo de acceso: 'subscription' = guardado temporal, 'permanent' = comprado para siempre
  tipoCompra: { type: String, enum: ['subscription', 'permanent'], default: 'subscription' },
}, { timestamps: true });

libraryItemSchema.index({ usuario: 1, libro: 1 }, { unique: true });

export default mongoose.model('ElementoBiblioteca', libraryItemSchema, 'biblioteca_usuario');
