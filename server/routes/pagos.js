// ============================================================
// server/routes/pagos.js — Rutas de Pagos
// ============================================================
// Maneja el historial de transacciones de cada usuario:
// ver pagos, obtener detalle de un pago, registrar un nuevo pago.
// Todas las rutas requieren autenticación.

import { Router } from 'express';
import Pago from '../models/Pagos.js';
import { middlewareAuth } from '../middleware/auth.js';

const router = Router();

// ============================================================
// GET / — Obtener historial de pagos del usuario logueado
// .populate() trae información del libro y plan asociados al pago
// ============================================================
router.get('/', middlewareAuth, async (req, res) => {
  try {
    const pagos = await Pago.find({ usuario: req.user.id })
      .populate('libro', 'titulo autor portada')  // Solo traer campos específicos del libro
      .populate('plan', 'nombre precio')           // Solo traer nombre y precio del plan
      .sort('-createdAt');                         // Más recientes primero
    res.json(pagos);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// ============================================================
// GET /:id — Obtener detalle de un pago específico
// Solo retorna pagos que pertenezcan al usuario logueado
// ============================================================
router.get('/:id', middlewareAuth, async (req, res) => {
  try {
    const pago = await Pago.findOne({ _id: req.params.id, usuario: req.user.id })
      .populate('libro', 'titulo autor portada')
      .populate('plan', 'nombre precio');
    if (!pago) return res.status(404).json({ message: 'Pago no encontrado' });
    res.json(pago);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// ============================================================
// POST / — Registrar un nuevo pago
// Recibe: libro (opcional), plan (opcional), monto, metodoPago, idTransaccion
// NOTA: El pago es simulado, no conecta con una pasarela de pago real
// ============================================================
router.post('/', middlewareAuth, async (req, res) => {
  try {
    const { libro, plan, monto, metodoPago, idTransaccion } = req.body;
    const pago = await Pago.create({
      usuario: req.user.id,
      libro,           // ID del libro comprado (null si es un plan)
      plan,            // ID del plan comprado (null si es un libro)
      monto,           // Cantidad pagada
      metodoPago,      // Método: "Tarjeta de crédito", "PayPal", etc.
      idTransaccion,   // ID único de la transacción (generado en el frontend)
    });
    res.status(201).json(pago);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

export default router;