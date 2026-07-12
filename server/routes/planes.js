import { Router } from 'express';
import Plan from '../models/Planes.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const planes = await Plan.find();
    res.json(planes);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

export default router;