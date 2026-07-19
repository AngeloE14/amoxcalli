// ============================================================
// server/routes/planes.js — Rutas de Planes de Suscripción
// ============================================================
// Endpoint público que retorna todos los planes disponibles.
// Los planes se usan en la página de selección de planes (/plans).

import { Router } from 'express';
import Plan from '../models/Planes.js';

const router = Router();

// ============================================================
// GET / — Listar todos los planes de suscripción
// Público: no requiere autenticación
// ============================================================
router.get('/', async (req, res) => {
  try {
    const planes = await Plan.find();
    res.json(planes);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

export default router;