import mongoose from 'mongoose';

const libraryItemSchema = new mongoose.Schema({
  // ref debe coincidir con el nombre del modelo registrado en mongoose.model()
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  libro: { type: mongoose.Schema.Types.ObjectId, ref: 'Libro', required: true },
  tipoCompra: { type: String, enum: ['subscription', 'permanent'], default: 'subscription' },
}, { timestamps: true });

// Índice único para que un usuario no pueda guardar el mismo libro dos veces
libraryItemSchema.index({ usuario: 1, libro: 1 }, { unique: true });

export default mongoose.model('ElementoBiblioteca', libraryItemSchema, 'biblioteca_usuario');
