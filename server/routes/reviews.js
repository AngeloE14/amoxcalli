import { Router } from 'express';
import Resena from '../models/Review.js';
import { middlewareAuth } from '../middleware/auth.js';

const router = Router();

router.post('/', middlewareAuth, async (req, res) => {
  try {
    const { bookId, rating, comment } = req.body;
    const existente = await Resena.findOne({ user: req.user.id, book: bookId });
    if (existente) return res.status(400).json({ message: 'Ya has reseñado este libro' });

    const resena = await Resena.create({ user: req.user.id, book: bookId, rating, comment });
    const poblada = await resena.populate('user', 'name');
    res.status(201).json(poblada);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

router.get('/me', middlewareAuth, async (req, res) => {
  try {
    const resenas = await Resena.find({ user: req.user.id })
      .populate('book', 'title author coverUrl')
      .sort('-createdAt');
    res.json(resenas);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

router.delete('/:id', middlewareAuth, async (req, res) => {
  try {
    const resena = await Resena.findOne({ _id: req.params.id, user: req.user.id });
    if (!resena) return res.status(404).json({ message: 'Reseña no encontrada' });
    await resena.deleteOne();
    res.json({ message: 'Reseña eliminada' });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

export default router;
