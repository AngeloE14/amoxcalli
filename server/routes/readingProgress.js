import { Router } from 'express';
import ProgresoLectura from '../models/ReadingProgress.js';
import { middlewareAuth } from '../middleware/auth.js';

const router = Router();

router.get('/:bookId', middlewareAuth, async (req, res) => {
  try {
    const progreso = await ProgresoLectura.findOne({ user: req.user.id, book: req.params.bookId });
    res.json(progreso || { paragraph: 0, percentage: 0 });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

router.post('/:bookId', middlewareAuth, async (req, res) => {
  try {
    const { paragraph, percentage } = req.body;
    const progreso = await ProgresoLectura.findOneAndUpdate(
      { user: req.user.id, book: req.params.bookId },
      { paragraph, percentage },
      { upsert: true, new: true }
    );
    res.json(progreso);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

export default router;
