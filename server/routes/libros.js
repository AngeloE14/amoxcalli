import { Router } from 'express';
import Libro from '../models/Libros.js';
import { middlewareAuth, middlewareAdmin } from '../middleware/auth.js';

const router = Router();

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

router.get('/:id', async (req, res) => {
  try {
    const libro = await Libro.findById(req.params.id);
    if (!libro) return res.status(404).json({ message: 'Libro no encontrado' });
    res.json(libro);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

router.post('/', middlewareAuth, middlewareAdmin, async (req, res) => {
  try {
    const { titulo, autor, descripcion, portada, genero, idioma, precio, paginas, contenido } = req.body;
    const libro = await Libro.create({ titulo, autor, descripcion, portada, genero, idioma, precio, paginas, contenido });
    res.status(201).json(libro);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

router.put('/:id', middlewareAuth, middlewareAdmin, async (req, res) => {
  try {
    const libro = await Libro.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!libro) return res.status(404).json({ message: 'Libro no encontrado' });
    res.json(libro);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

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