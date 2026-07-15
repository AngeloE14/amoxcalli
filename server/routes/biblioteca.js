import { Router } from 'express';
import ElementoBiblioteca from '../models/ElementosBiblioteca.js';
import { middlewareAuth } from '../middleware/auth.js';

const router = Router();

// Todas las rutas de biblioteca requieren autenticación
router.use(middlewareAuth);

// GET / — Devolver todos los libros guardados del usuario
router.get('/', async (req, res) => {
  try {
    const elementos = await ElementoBiblioteca.find({ usuario: req.user.id })
      .populate('libro')
      .sort('-createdAt');
    res.json(elementos);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { bookId, tipoCompra } = req.body;
    const existente = await ElementoBiblioteca.findOne({ usuario: req.user.id, libro: bookId });
    if (existente) return res.status(400).json({ message: 'El libro ya está en tu biblioteca' });

    const elemento = await ElementoBiblioteca.create({
      usuario: req.user.id,
      libro: bookId,
      tipoCompra: tipoCompra || 'subscription',
    });
    const poblado = await elemento.populate('libro');
    res.status(201).json(poblado);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

router.delete('/:bookId', async (req, res) => {
  try {
    await ElementoBiblioteca.findOneAndDelete({ usuario: req.user.id, libro: req.params.bookId });
    res.json({ message: 'Eliminado de la biblioteca' });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

export default router;