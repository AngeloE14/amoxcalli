// ============================================================
// server/routes/biblioteca.js — Rutas de Biblioteca del Usuario
// ============================================================
// Maneja la biblioteca personal de cada usuario:
// ver libros guardados, agregar libros, eliminar libros.
// Todas las rutas requieren autenticación.

import { Router } from 'express';
import ElementoBiblioteca from '../models/ElementosBiblioteca.js';
import { middlewareAuth } from '../middleware/auth.js';

const router = Router();

// Aplicar middleware de autenticación a TODAS las rutas de este archivo
router.use(middlewareAuth);

// ============================================================
// GET / — Obtener todos los libros guardados del usuario logueado
// .populate('libro') reemplaza el ObjectId del libro con todos sus datos
// ============================================================
router.get('/', async (req, res) => {
  try {
    const elementos = await ElementoBiblioteca.find({ usuario: req.user.id })
      .populate('libro')      // Traer toda la info del libro (no solo el ID)
      .sort('-createdAt');    // Ordenar por más recientes primero
    res.json(elementos);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// ============================================================
// POST / — Agregar un libro a la biblioteca del usuario
// Recibe: bookId (ID del libro) y tipoCompra ('subscription' o 'permanent')
// ============================================================
router.post('/', async (req, res) => {
  try {
    const { bookId, tipoCompra } = req.body;
    // Verificar que el libro no esté ya guardado (el índice único lo previene también)
    const existente = await ElementoBiblioteca.findOne({ usuario: req.user.id, libro: bookId });
    if (existente) return res.status(400).json({ message: 'El libro ya está en tu biblioteca' });

    const elemento = await ElementoBiblioteca.create({
      usuario: req.user.id,
      libro: bookId,
      tipoCompra: tipoCompra || 'subscription', // Por defecto es 'subscription' (guardado)
    });
    const poblado = await elemento.populate('libro'); // Retornar con datos del libro
    res.status(201).json(poblado);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// ============================================================
// DELETE /:bookId — Eliminar un libro de la biblioteca
// ============================================================
router.delete('/:bookId', async (req, res) => {
  try {
    await ElementoBiblioteca.findOneAndDelete({ usuario: req.user.id, libro: req.params.bookId });
    res.json({ message: 'Eliminado de la biblioteca' });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

export default router;