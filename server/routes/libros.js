import { Router } from 'express';
import Libro from '../models/Libros.js';
import { middlewareAuth, middlewareAdmin } from '../middleware/auth.js';

const router = Router();

// GET / — Listar libros con filtros opcionales (genre, search, author, language, sort)
router.get('/', async (req, res) => {
  try {
    const { genre, search, author, language, sort } = req.query;
    let filtro = {};
    if (genre) filtro.genero = genre;
    if (search) filtro.titulo = { $regex: search, $options: 'i' };
    if (author) filtro.autor = { $regex: author, $options: 'i' };
    if (language) filtro.idioma = language;

    let orden = {};
    if (sort === 'title') orden.titulo = 1;
    else if (sort === 'author') orden.autor = 1;
    else if (sort === 'price_asc') orden.precio = 1;
    else if (sort === 'price_desc') orden.precio = -1;
    else if (sort === 'newest') orden.createdAt = -1;

    const libros = await Libro.find(filtro).sort(orden);
    res.json(libros);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// GET /:id — Obtener un libro por ID
router.get('/:id', async (req, res) => {
  try {
    const libro = await Libro.findById(req.params.id);
    if (!libro) return res.status(404).json({ message: 'Libro no encontrado' });
    res.json(libro);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// GET /:id/pdf — Proxy de PDF: descarga el PDF desde la URL externa y lo sirve al navegador
// (necesario porque el frontend no puede cargar PDFs directamente por restricciones de CORS)
router.get('/:id/pdf', async (req, res) => {
  try {
    const libro = await Libro.findById(req.params.id);
    if (!libro) return res.status(404).json({ message: 'Libro no encontrado' });
    if (!libro.pdfUrl) return res.status(404).json({ message: 'PDF no disponible' });

    const respuesta = await fetch(libro.pdfUrl);
    if (!respuesta.ok) return res.status(502).json({ message: 'No se pudo obtener el PDF desde la fuente externa' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${libro.titulo}.pdf"`);

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

// POST / — Crear libro (solo admin)
router.post('/', middlewareAuth, middlewareAdmin, async (req, res) => {
  try {
    const { titulo, autor, descripcion, portada, genero, idioma, precio, paginas, contenido, pdfUrl } = req.body;
    const libro = await Libro.create({ titulo, autor, descripcion, portada, genero, idioma, precio, paginas, contenido, pdfUrl });
    res.status(201).json(libro);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// PUT /:id — Actualizar libro (solo admin)
router.put('/:id', middlewareAuth, middlewareAdmin, async (req, res) => {
  try {
    const libro = await Libro.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!libro) return res.status(404).json({ message: 'Libro no encontrado' });
    res.json(libro);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// DELETE /:id — Eliminar libro (solo admin)
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
