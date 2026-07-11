import { Router } from 'express';
import Transaccion from '../models/Transaction.js';
import { middlewareAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', middlewareAuth, async (req, res) => {
  try {
    const transacciones = await Transaccion.find({ user: req.user.id })
      .sort('-createdAt');
    res.json(transacciones);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

export default router;
