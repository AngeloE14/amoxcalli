// ============================================================
// src/components/ProtectedRoute.jsx — Guarda de Ruta Protegida
// ============================================================
// Componente que protege rutas que requieren autenticación.
// Si el usuario no está logueado, lo redirige a /login.
// Se usa envolviendo los componentes de páginas protegidas en App.jsx.

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RutaProtegida({ children }) {
  const { usuario, cargando } = useAuth();

  // Mientras se verifica la sesión, mostrar mensaje de carga
  if (cargando) return <div className="loading">Cargando...</div>;
  // Si no hay usuario logueado, redirigir a la página de login
  if (!usuario) return <Navigate to="/login" replace />;

  // Si hay sesión, mostrar el contenido protegido
  return children;
}
