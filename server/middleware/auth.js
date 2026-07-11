import jwt from 'jsonwebtoken';

const SECRETO_JWT = process.env.JWT_SECRET || 'amoxcalli_secret_key_2024';

export const middlewareAuth = (req, res, next) => {
  const cabecera = req.headers.authorization;
  if (!cabecera || !cabecera.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No se proporcionó token de autenticación' });
  }

  const token = cabecera.split(' ')[1];

  try {
    const decodificado = jwt.verify(token, SECRETO_JWT);
    req.user = decodificado;
    next();
  } catch {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

export const middlewareAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Se requiere acceso de administrador' });
  }
  next();
};

export const generarToken = (usuario) => {
  return jwt.sign(
    { id: usuario._id, email: usuario.email, name: usuario.name, role: usuario.role },
    SECRETO_JWT,
    { expiresIn: '7d' }
  );
};
