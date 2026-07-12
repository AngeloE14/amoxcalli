import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  autor: { type: String, required: true },
  descripcion: { type: String, required: true },
  portada: { type: String, default: '' },
  genero: { type: String, required: true },
  idioma: { type: String, default: 'Español' },
  precio: { type: Number, default: 9.99 },
  paginas: { type: Number, default: 0 },
  contenido: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('Libro', bookSchema, 'libros');
