import { Router } from 'express';
import Libro from '../models/Book.js';
import Resena from '../models/Review.js';
import { middlewareAuth, middlewareAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { genre, search, author, language, sort } = req.query;
    let filtro = {};
    if (genre) filtro.genre = genre;
    if (search) filtro.title = { $regex: search, $options: 'i' };
    if (author) filtro.author = { $regex: author, $options: 'i' };
    if (language) filtro.language = language;

    let orden = {};
    if (sort === 'title') orden.title = 1;
    else if (sort === 'author') orden.author = 1;
    else if (sort === 'price_asc') orden.price = 1;
    else if (sort === 'price_desc') orden.price = -1;
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

router.get('/:id/reviews', async (req, res) => {
  try {
    const resenas = await Resena.find({ book: req.params.id })
      .populate('user', 'name')
      .sort('-createdAt');
    res.json(resenas);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

router.post('/', middlewareAuth, middlewareAdmin, async (req, res) => {
  try {
    const { title, author, description, coverUrl, genre, language, price, pages, content } = req.body;
    const libro = await Libro.create({ title, author, description, coverUrl, genre, language, price, pages, content });
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
