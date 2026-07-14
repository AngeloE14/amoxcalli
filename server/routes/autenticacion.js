import { Router } from 'express';
import Usuario from '../models/Usuarios.js';
import { generarToken, middlewareAuth } from '../middleware/auth.js';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const { nombre, correo, contraseña } = req.body;
    const existe = await Usuario.findOne({ correo });
    if (existe) return res.status(400).json({ message: 'El correo ya está registrado' });

    const usuario = await Usuario.create({ nombre, correo, contraseña });
    const token = generarToken(usuario);
    // Se incluye plan en la respuesta para que el frontend sepa qué plan tiene el usuario
    res.status(201).json({ token, user: { id: usuario._id, nombre: usuario.nombre, correo: usuario.correo, rol: usuario.rol, plan: usuario.plan } });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { correo, contraseña } = req.body;
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) return res.status(400).json({ message: 'Credenciales incorrectas' });

    const coincide = await usuario.comparePassword(contraseña);
    if (!coincide) return res.status(400).json({ message: 'Credenciales incorrectas' });

    const token = generarToken(usuario);
    // Lo mismo en login, para que al iniciar sesión el frontend reciba el plan
    res.json({ token, user: { id: usuario._id, nombre: usuario.nombre, correo: usuario.correo, rol: usuario.rol, plan: usuario.plan } });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

router.get('/me', middlewareAuth, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.user.id).select('-contraseña');
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

router.put('/profile', middlewareAuth, async (req, res) => {
  try {
    // Se acepta plan en el body para que el frontend pueda cambiar el plan del usuario
    const { nombre, correo, plan } = req.body;
    const actualizaciones = {};
    if (nombre) actualizaciones.nombre = nombre;
    if (correo) {
      const existe = await Usuario.findOne({ correo, _id: { $ne: req.user.id } });
      if (existe) return res.status(400).json({ message: 'El correo ya está en uso' });
      actualizaciones.correo = correo;
    }
    if (plan !== undefined) actualizaciones.plan = plan;
    const usuario = await Usuario.findByIdAndUpdate(req.user.id, actualizaciones, { new: true }).select('-contraseña');
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

router.put('/password', middlewareAuth, async (req, res) => {
  try {
    const { contraseñaActual, contraseñaNueva } = req.body;
    const usuario = await Usuario.findById(req.user.id);
    const coincide = await usuario.comparePassword(contraseñaActual);
    if (!coincide) return res.status(400).json({ message: 'La contraseña actual es incorrecta' });

    usuario.contraseña = contraseñaNueva;
    await usuario.save();
    res.json({ message: 'Contraseña actualizada' });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

router.delete('/delete', middlewareAuth, async (req, res) => {
  try {
    await Usuario.findByIdAndDelete(req.user.id);
    res.json({ message: 'Cuenta eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

export default router;
