// ============================================================
// server/models/ElementosBiblioteca.js — Modelo de Biblioteca (MongoDB)
// ============================================================
// Representa un libro guardado en la biblioteca de un usuario.
// Cada registro indica: qué usuario guardó qué libro y si fue por
// suscripción (guardado temporal) o compra permanente.

import mongoose from 'mongoose';

const libraryItemSchema = new mongoose.Schema({
  // Referencia al modelo 'Usuario': vincula el elemento con un usuario
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  // Referencia al modelo 'Libro': vincula el elemento con un libro
  libro: { type: mongoose.Schema.Types.ObjectId, ref: 'Libro', required: true },
  // Tipo de acceso: 'subscription' = guardado temporal, 'permanent' = comprado para siempre
  tipoCompra: { type: String, enum: ['subscription', 'permanent'], default: 'subscription' },
}, { timestamps: true });

// ============================================================
// Índice único compuesto: Evita que un usuario guarde el mismo libro dos veces
// MongoDB rechazará la inserción si ya existe un registro con el mismo usuario + libro
// ============================================================
libraryItemSchema.index({ usuario: 1, libro: 1 }, { unique: true });

// Exportar el modelo. 'biblioteca_usuario' es el nombre de la colección en MongoDB
export default mongoose.model('ElementoBiblioteca', libraryItemSchema, 'biblioteca_usuario');
