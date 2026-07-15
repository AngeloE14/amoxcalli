import { Router } from 'express';
import Pago from '../models/Pagos.js';
import { middlewareAuth } from '../middleware/auth.js';

const router = Router();

// GET / — Historial de pagos del usuario autenticado
router.get('/', middlewareAuth, async (req, res) => {
  try {
    const pagos = await Pago.find({ usuario: req.user.id })
      .populate('libro', 'titulo autor portada')
      .populate('plan', 'nombre precio')
      .sort('-createdAt');
    res.json(pagos);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

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

router.post('/', middlewareAuth, async (req, res) => {
  try {
    const { libro, plan, monto, metodoPago, idTransaccion } = req.body;
    const pago = await Pago.create({
      usuario: req.user.id,
      libro,
      plan,
      monto,
      metodoPago,
      idTransaccion,
    });
    res.status(201).json(pago);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

export default router;