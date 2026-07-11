import { Router } from 'express';
import Suscripcion from '../models/Subscription.js';
import Plan from '../models/Plan.js';
import Transaccion from '../models/Transaction.js';
import { middlewareAuth } from '../middleware/auth.js';

const router = Router();

function generarIdTransaccion() {
  return 'TXN-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8).toUpperCase();
}

router.post('/', middlewareAuth, async (req, res) => {
  try {
    const { planId, paymentMethod } = req.body;
    const plan = await Plan.findById(planId);
    if (!plan) return res.status(404).json({ message: 'Plan no encontrado' });

    const existente = await Suscripcion.findOne({ user: req.user.id, active: true });
    if (existente) return res.status(400).json({ message: 'Ya tienes una suscripción activa' });

    const fechaFin = new Date();
    fechaFin.setDate(fechaFin.getDate() + plan.durationDays);

    const suscripcion = await Suscripcion.create({
      user: req.user.id,
      plan: planId,
      endDate: fechaFin,
    });

    const idTransaccion = generarIdTransaccion();
    await Transaccion.create({
      user: req.user.id,
      type: 'subscription',
      amount: plan.price,
      description: `Suscripción: ${plan.name} (${plan.durationDays} días)`,
      paymentMethod: paymentMethod || 'Tarjeta de crédito',
      transactionId: idTransaccion,
    });

    const poblada = await suscripcion.populate('plan');
    res.status(201).json(poblada);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

router.get('/me', middlewareAuth, async (req, res) => {
  try {
    const suscripcion = await Suscripcion.findOne({ user: req.user.id, active: true }).populate('plan');
    if (!suscripcion) return res.json(null);
    if (new Date() > suscripcion.endDate) {
      suscripcion.active = false;
      await suscripcion.save();
      return res.json(null);
    }
    res.json(suscripcion);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

export default router;
