import { Router } from 'express';
import Usuario from '../models/User.js';
import { generarToken, middlewareAuth } from '../middleware/auth.js';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existe = await Usuario.findOne({ email });
    if (existe) return res.status(400).json({ message: 'El email ya está registrado' });

    const usuario = await Usuario.create({ name, email, password });
    const token = generarToken(usuario);
    res.status(201).json({ token, user: { id: usuario._id, name: usuario.name, email: usuario.email, role: usuario.role } });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ email });
    if (!usuario) return res.status(400).json({ message: 'Credenciales incorrectas' });

    const coincide = await usuario.comparePassword(password);
    if (!coincide) return res.status(400).json({ message: 'Credenciales incorrectas' });

    const token = generarToken(usuario);
    res.json({ token, user: { id: usuario._id, name: usuario.name, email: usuario.email, role: usuario.role } });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

router.get('/me', middlewareAuth, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.user.id).select('-password');
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

router.put('/profile', middlewareAuth, async (req, res) => {
  try {
    const { name, email } = req.body;
    const actualizaciones = {};
    if (name) actualizaciones.name = name;
    if (email) {
      const existe = await Usuario.findOne({ email, _id: { $ne: req.user.id } });
      if (existe) return res.status(400).json({ message: 'El email ya está en uso' });
      actualizaciones.email = email;
    }
    const usuario = await Usuario.findByIdAndUpdate(req.user.id, actualizaciones, { new: true }).select('-password');
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

router.put('/password', middlewareAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const usuario = await Usuario.findById(req.user.id);
    const coincide = await usuario.comparePassword(currentPassword);
    if (!coincide) return res.status(400).json({ message: 'La contraseña actual es incorrecta' });

    usuario.password = newPassword;
    await usuario.save();
    res.json({ message: 'Contraseña actualizada' });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

export default router;
