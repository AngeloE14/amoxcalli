// ============================================================
// server/middleware/auth.js — Middleware de autenticación JWT
// ============================================================
// Los middlewares son funciones que se ejecutan ANTES de llegar al
// endpoint final. Verifican que el usuario esté logueado y/o sea admin.

import jwt from 'jsonwebtoken';

// Clave secreta para firmar/verificar tokens (está en .env)
const SECRETO_JWT = process.env.JWT_SECRET || 'amoxcalli_secret_key_2024';

// ============================================================
// middlewareAuth: Verifica que el request tenga un token JWT válido
// Se usa en todas las rutas que requieren que el usuario esté logueado
// ============================================================
export const middlewareAuth = (req, res, next) => {
  // Las peticiones autenticadas envían el token en el header "Authorization: Bearer <token>"
  const cabecera = req.headers.authorization;
  if (!cabecera || !cabecera.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No se proporcionó token de autenticación' });
  }

  // Extraer solo el token (sin el prefijo "Bearer ")
  const token = cabecera.split(' ')[1];

  try {
    // jwt.verify decodifica y valida el token. Si es válido, retorna los datos del usuario
    const decodificado = jwt.verify(token, SECRETO_JWT);
    req.user = decodificado; // Adjuntar datos del usuario al request para usarlos después
    next(); // Continuar al siguiente middleware o al endpoint
  } catch {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

// ============================================================
// middlewareAdmin: Solo permite acceso si el usuario tiene rol 'admin'
// Se usa DESPUÉS de middlewareAuth en rutas de administración
// ============================================================
export const middlewareAdmin = (req, res, next) => {
  if (req.user.rol !== 'admin') {
    return res.status(403).json({ message: 'Se requiere acceso de administrador' });
  }
  next();
};

// ============================================================
// generarToken: Crea un token JWT con los datos del usuario
// El token expira en 7 días y se guarda en el navegador (localStorage)
// ============================================================
export const generarToken = (usuario) => {
  return jwt.sign(
    // Payload: datos que se guardan dentro del token
    { id: usuario._id, correo: usuario.correo, nombre: usuario.nombre, rol: usuario.rol },
    SECRETO_JWT,
    { expiresIn: '7d' } // El token expira en 7 días
  );
};
