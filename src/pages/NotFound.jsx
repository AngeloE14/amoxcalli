// ============================================================
// src/pages/NotFound.jsx — Página 404
// ============================================================
// Se muestra cuando el usuario navega a una URL que no existe.
// Ofrece un enlace para volver al inicio.

import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="not-found">
      <h1>404</h1>
      <p>Página no encontrada</p>
      <Link to="/" className="btn btn-primary btn-lg">Volver al inicio</Link>
    </div>
  );
}
