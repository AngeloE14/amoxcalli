import { Router } from 'express';
import ElementoBiblioteca from '../models/LibraryItem.js';
import { middlewareAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', middlewareAuth, async (req, res) => {
  try {
    const elementos = await ElementoBiblioteca.find({ user: req.user.id })
      .populate('book')
      .sort('-createdAt');
    res.json(elementos);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

router.post('/', middlewareAuth, async (req, res) => {
  try {
    const { bookId, purchaseType } = req.body;
    const existente = await ElementoBiblioteca.findOne({ user: req.user.id, book: bookId });
    if (existente) return res.status(400).json({ message: 'El libro ya está en tu biblioteca' });

    const elemento = await ElementoBiblioteca.create({
      user: req.user.id,
      book: bookId,
      purchaseType: purchaseType || 'subscription',
    });
    const poblado = await elemento.populate('book');
    res.status(201).json(poblado);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

router.delete('/:bookId', middlewareAuth, async (req, res) => {
  try {
    await ElementoBiblioteca.findOneAndDelete({ user: req.user.id, book: req.params.bookId });
    res.json({ message: 'Eliminado de la biblioteca' });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

export default router;
