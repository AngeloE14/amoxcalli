// ============================================================
// server/routes/libros.js — Rutas del Catálogo de Libros
// ============================================================
// Maneja las operaciones CRUD de libros:
// - Consulta pública: listar, buscar, filtrar, ver detalle
// - PDF proxy: sirve el PDF evitando problemas de CORS
// - Admin: crear, editar, eliminar libros

import { Router } from 'express';
import Libro from '../models/Libros.js';
import { middlewareAuth, middlewareAdmin } from '../middleware/auth.js';

const router = Router();

// ============================================================
// GET / — Listar libros con filtros opcionales
// Público: no requiere autenticación
// Parámetros de query: genre, search, author, language, sort
// ============================================================
router.get('/', async (req, res) => {
  try {
    const { genre, search, author, language, sort } = req.query;
    let filtro = {};
    // Construir filtros dinámicamente según los parámetros recibidos
    if (genre) filtro.genero = genre;                              // Filtrar por género
    if (search) filtro.titulo = { $regex: search, $options: 'i' }; // Búsqueda parcial por título (case-insensitive)
    if (author) filtro.autor = { $regex: author, $options: 'i' };  // Búsqueda parcial por autor
    if (language) filtro.idioma = language;                         // Filtrar por idioma exacto

    // Construir ordenamiento según el parámetro "sort"
    let orden = {};
    if (sort === 'title') orden.titulo = 1;        // A-Z por título
    else if (sort === 'author') orden.autor = 1;   // A-Z por autor
    else if (sort === 'price_asc') orden.precio = 1;  // Menor precio primero
    else if (sort === 'price_desc') orden.precio = -1; // Mayor precio primero
    else if (sort === 'newest') orden.createdAt = -1;  // Más recientes primero

    const libros = await Libro.find(filtro).sort(orden);
    res.json(libros);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// ============================================================
// GET /:id — Obtener un libro por su ID
// Público: no requiere autenticación
// ============================================================
router.get('/:id', async (req, res) => {
  try {
    const libro = await Libro.findById(req.params.id);
    if (!libro) return res.status(404).json({ message: 'Libro no encontrado' });
    res.json(libro);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// ============================================================
// GET /:id/pdf — Proxy de PDF
// Público: sirve el PDF desde la URL externa del libro
// IMPORTANTE: El frontend NO puede cargar PDFs directamente desde
// URLs externas por restricciones de CORS. Este endpoint actúa como
// intermediario: descarga el PDF del servidor y lo envía al navegador.
// ============================================================
router.get('/:id/pdf', async (req, res) => {
  try {
    const libro = await Libro.findById(req.params.id);
    if (!libro) return res.status(404).json({ message: 'Libro no encontrado' });
    if (!libro.pdfUrl) return res.status(404).json({ message: 'PDF no disponible' });

    // Descargar el PDF desde la URL externa usando fetch
    const respuesta = await fetch(libro.pdfUrl);
    if (!respuesta.ok) return res.status(502).json({ message: 'No se pudo obtener el PDF desde la fuente externa' });

    // Configurar headers para que el navegador lo trate como PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${libro.titulo}.pdf"`);

    // Streaming: leer el PDF en chunks y enviarlo al cliente
    const reader = respuesta.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(value);
    }
    res.end();
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el PDF' });
  }
});

// ============================================================
// POST / — Crear un libro nuevo (Solo admin)
// Requiere: token JWT + rol 'admin'
// ============================================================
router.post('/', middlewareAuth, middlewareAdmin, async (req, res) => {
  try {
    // Se incluye pdfUrl para que el admin pueda asignar la URL del PDF al crear un libro
    const { titulo, autor, descripcion, portada, genero, idioma, precio, paginas, contenido, pdfUrl } = req.body;
    const libro = await Libro.create({ titulo, autor, descripcion, portada, genero, idioma, precio, paginas, contenido, pdfUrl });
    res.status(201).json(libro);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// ============================================================
// PUT /:id — Actualizar un libro existente (Solo admin)
// Requiere: token JWT + rol 'admin'
// ============================================================
router.put('/:id', middlewareAuth, middlewareAdmin, async (req, res) => {
  try {
    // { new: true } retorna el libro actualizado (no el original)
    const libro = await Libro.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!libro) return res.status(404).json({ message: 'Libro no encontrado' });
    res.json(libro);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// ============================================================
// DELETE /:id — Eliminar un libro (Solo admin)
// Requiere: token JWT + rol 'admin'
// ============================================================
router.delete('/:id', middlewareAuth, middlewareAdmin, async (req, res) => {
  try {
    const libro = await Libro.findByIdAndDelete(req.params.id);
    if (!libro) return res.status(404).json({ message: 'Libro no encontrado' });
    res.json({ message: 'Libro eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

export default router;