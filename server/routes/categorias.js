// ============================================================
// server/routes/categorias.js — Rutas de Categorías
// ============================================================
// Endpoints públicos para obtener las categorías de libros.
// Actualmente se usa más el campo "genero" directamente en los libros.

import { Router } from 'express';
import Categoria from '../models/Categorias.js';

const router = Router();

// ============================================================
// GET / — Listar todas las categorías
// Público: no requiere autenticación
// ============================================================
router.get('/', async (req, res) => {
  try {
    const categorias = await Categoria.find();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// ============================================================
// GET /:id — Obtener una categoría específica por su ID
// Público: no requiere autenticación
// ============================================================
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