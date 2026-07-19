// ============================================================
// server/models/Categorias.js — Modelo de Categoría (MongoDB)
// ============================================================
// Define las categorías de libros (ej: "Novela", "Ciencia Ficción", etc.)
// Actualmente se usa más el campo "genero" directamente en el modelo Libros.

import mongoose from 'mongoose';

const categoriaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },     // Nombre de la categoría
  descripcion: { type: String, default: '' },    // Descripción de la categoría
}, { timestamps: true });

// Exportar el modelo. 'categorias' es el nombre de la colección en MongoDB
export default mongoose.model('Categoria', categoriaSchema, 'categorias');