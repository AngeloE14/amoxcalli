// ============================================================
// server/models/Libros.js — Modelo de Libro (MongoDB)
// ============================================================
// Define la estructura de los documentos en la colección "libros".
// Un libro tiene toda la información del catálogo + URL del PDF para el lector.

import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  titulo: { type: String, required: true },          // Título del libro (obligatorio)
  autor: { type: String, required: true },            // Nombre del autor (obligatorio)
  descripcion: { type: String, required: true },      // Sinopsis o descripción del libro
  portada: { type: String, default: '' },             // URL de la imagen de portada
  genero: { type: String, required: true },           // Género literario (Novela, Ciencia Ficción, etc.)
  idioma: { type: String, default: 'Español' },       // Idioma del libro
  precio: { type: Number, default: 9.99 },            // Precio en MXN (pesos mexicanos)
  paginas: { type: Number, default: 0 },              // Número total de páginas
  contenido: { type: String, default: '' },           // Texto del libro (contenido completo)
  pdfUrl: { type: String, default: '' },              // URL externa del archivo PDF para el lector
}, { timestamps: true }); // Crea automáticamente createdAt y updatedAt

// Exportar el modelo. 'libros' es el nombre de la colección en MongoDB
export default mongoose.model('Libro', bookSchema, 'libros');
