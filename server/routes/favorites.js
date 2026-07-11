import { Router } from 'express';
import Favorito from '../models/Favorite.js';
import { middlewareAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', middlewareAuth, async (req, res) => {
  try {
    const favoritos = await Favorito.find({ user: req.user.id })
      .populate('book')
      .sort('-createdAt');
    res.json(favoritos);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

router.post('/', middlewareAuth, async (req, res) => {
  try {
    const { bookId } = req.body;
    const existente = await Favorito.findOne({ user: req.user.id, book: bookId });
    if (existente) return res.status(400).json({ message: 'Ya está en favoritos' });

    const favorito = await Favorito.create({ user: req.user.id, book: bookId });
    const poblado = await favorito.populate('book');
    res.status(201).json(poblado);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

router.delete('/:bookId', middlewareAuth, async (req, res) => {
  try {
    await Favorito.findOneAndDelete({ user: req.user.id, book: req.params.bookId });
    res.json({ message: 'Eliminado de favoritos' });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

export default router;
