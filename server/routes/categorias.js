import { Router } from 'express';
import Categoria from '../models/Categorias.js';

const router = Router();

// GET / — Todas las categorías
router.get('/', async (req, res) => {
  try {
    const categorias = await Categoria.find();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// GET /:id — Una categoría por ID
router.get('/:id', async (req, res) => {
  try {
    const categoria = await Categoria.findById(req.params.id);
    if (!categoria) return res.status(404).json({ message: 'Categoría no encontrada' });
    res.json(categoria);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

export default router;
