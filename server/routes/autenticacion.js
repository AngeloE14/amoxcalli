// ============================================================
// server/routes/autenticacion.js — Rutas de Autenticación
// ============================================================
// Maneja todo lo relacionado con cuentas de usuario:
// registro, login, obtener perfil, actualizar perfil,
// cambiar contraseña y eliminar cuenta.

import { Router } from 'express';
import Usuario from '../models/Usuarios.js';
import { generarToken, middlewareAuth } from '../middleware/auth.js';

const router = Router();

// ============================================================
// POST /register — Crear una cuenta nueva
// Recibe: nombre, correo, contraseña
// Retorna: token JWT + datos del usuario (sin contraseña)
// ============================================================
router.post('/register', async (req, res) => {
  try {
    const { nombre, correo, contraseña } = req.body;
    // Verificar que el correo no esté registrado
    const existe = await Usuario.findOne({ correo });
    if (existe) return res.status(400).json({ message: 'El correo ya está registrado' });

    // Crear usuario (la contraseña se hashea automáticamente con el hook pre-save del modelo)
    const usuario = await Usuario.create({ nombre, correo, contraseña });
    const token = generarToken(usuario);
    // Se incluye plan en la respuesta para que el frontend sepa qué plan tiene el usuario
    res.status(201).json({ token, user: { id: usuario._id, nombre: usuario.nombre, correo: usuario.correo, rol: usuario.rol, plan: usuario.plan } });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// ============================================================
// POST /login — Iniciar sesión
// Recibe: correo, contraseña
// Retorna: token JWT + datos del usuario
// ============================================================
router.post('/login', async (req, res) => {
  try {
    const { correo, contraseña } = req.body;
    // Buscar usuario por correo
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) return res.status(400).json({ message: 'Credenciales incorrectas' });

    // Verificar que la contraseña sea correcta usando bcrypt
    const coincide = await usuario.comparePassword(contraseña);
    if (!coincide) return res.status(400).json({ message: 'Credenciales incorrectas' });

    const token = generarToken(usuario);
    // Lo mismo en login, para que al iniciar sesión el frontend reciba el plan
    res.json({ token, user: { id: usuario._id, nombre: usuario.nombre, correo: usuario.correo, rol: usuario.rol, plan: usuario.plan } });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// ============================================================
// GET /me — Obtener perfil del usuario logueado
// Requiere: token JWT válido (middlewareAuth)
// Retorna: datos del usuario sin la contraseña
// ============================================================
router.get('/me', middlewareAuth, async (req, res) => {
  try {
    // .select('-contraseña') excluye el campo contraseña de la respuesta
    const usuario = await Usuario.findById(req.user.id).select('-contraseña');
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// ============================================================
// PUT /profile — Actualizar perfil del usuario
// Requiere: token JWT válido
// Puede cambiar: nombre, correo y/o plan
// ============================================================
router.put('/profile', middlewareAuth, async (req, res) => {
  try {
    // Se acepta plan en el body para que el frontend pueda cambiar el plan del usuario
    const { nombre, correo, plan } = req.body;
    const actualizaciones = {};
    if (nombre) actualizaciones.nombre = nombre;
    if (correo) {
      // Verificar que el nuevo correo no lo tenga otro usuario
      const existe = await Usuario.findOne({ correo, _id: { $ne: req.user.id } });
      if (existe) return res.status(400).json({ message: 'El correo ya está en uso' });
      actualizaciones.correo = correo;
    }
    if (plan !== undefined) actualizaciones.plan = plan; // Permitir cambiar el plan
    const usuario = await Usuario.findByIdAndUpdate(req.user.id, actualizaciones, { new: true }).select('-contraseña');
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// ============================================================
// PUT /password — Cambiar contraseña
// Requiere: token JWT válido
// Recibe: contraseñaActual y contraseñaNueva
// ============================================================
router.put('/password', middlewareAuth, async (req, res) => {
  try {
    const { contraseñaActual, contraseñaNueva } = req.body;
    const usuario = await Usuario.findById(req.user.id);
    // Primero verificar que la contraseña actual sea correcta
    const coincide = await usuario.comparePassword(contraseñaActual);
    if (!coincide) return res.status(400).json({ message: 'La contraseña actual es incorrecta' });

    // Asignar nueva contraseña (se hashea automáticamente con el hook pre-save)
    usuario.contraseña = contraseñaNueva;
    await usuario.save();
    res.json({ message: 'Contraseña actualizada' });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// ============================================================
// DELETE /delete — Eliminar cuenta permanentemente
// Requiere: token JWT válido
// Esta acción es irreversible
// ============================================================
router.delete('/delete', middlewareAuth, async (req, res) => {
  try {
    await Usuario.findByIdAndDelete(req.user.id);
    res.json({ message: 'Cuenta eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

export default router;
