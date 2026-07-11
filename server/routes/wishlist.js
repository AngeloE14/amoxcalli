import { Router } from 'express';
import ElementoListaDeseos from '../models/WishlistItem.js';
import { middlewareAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', middlewareAuth, async (req, res) => {
  try {
    const elementos = await ElementoListaDeseos.find({ user: req.user.id })
      .populate('book')
      .sort('-createdAt');
    res.json(elementos);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

router.post('/', middlewareAuth, async (req, res) => {
  try {
    const { bookId } = req.body;
    const existente = await ElementoListaDeseos.findOne({ user: req.user.id, book: bookId });
    if (existente) return res.status(400).json({ message: 'Ya está en la lista de deseos' });

    const elemento = await ElementoListaDeseos.create({ user: req.user.id, book: bookId });
    const poblado = await elemento.populate('book');
    res.status(201).json(poblado);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

router.delete('/:bookId', middlewareAuth, async (req, res) => {
  try {
    await ElementoListaDeseos.findOneAndDelete({ user: req.user.id, book: req.params.bookId });
    res.json({ message: 'Eliminado de la lista de deseos' });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

export default router;
