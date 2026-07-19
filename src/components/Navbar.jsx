// ============================================================
// src/components/Navbar.jsx — Barra de Navegación
// ============================================================
// Aparece en TODAS las páginas. Muestra los enlaces de navegación
// y cambia según si el usuario está logueado o no.
// Tiene menú responsive para dispositivos móviles.

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { usuario, cerrarSesion } = useAuth(); // Datos del usuario logueado
  const ubicacion = useLocation();             // URL actual para resaltar el enlace activo
  const [menuAbierto, setMenuAbierto] = useState(false); // Estado del menú hamburguesa

  // Determinar qué enlace está activo (resaltado) según la URL actual
  const estaActiva = (ruta) => ubicacion.pathname === ruta;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo / Marca de la aplicación */}
        <Link to="/" className="navbar-brand">
          <span className="navbar-brand-icon">B</span>
          Amoxcalli
        </Link>

        {/* Botón hamburguesa: visible solo en móvil, abre/cierra el menú */}
        <button className={`navbar-toggle ${menuAbierto ? 'open' : ''}`} onClick={() => setMenuAbierto(!menuAbierto)} aria-label="Menú">
          <span /><span /><span />
        </button>

        {/* Enlaces de navegación: se muestran/ocultan según el estado del menú */}
        <div className={`navbar-links ${menuAbierto ? 'show' : ''}`}>
          {/* Enlaces siempre visibles */}
          <Link to="/catalog" className={`navbar-link ${estaActiva('/catalog') ? 'active' : ''}`} onClick={() => setMenuAbierto(false)}>
            Catálogo
          </Link>
          <Link to="/plans" className={`navbar-link ${estaActiva('/plans') ? 'active' : ''}`} onClick={() => setMenuAbierto(false)}>
            Planes
          </Link>

          {/* Enlaces que solo se muestran si el usuario está logueado */}
          {usuario ? (
            <>
              <Link to="/library" className={`navbar-link ${estaActiva('/library') ? 'active' : ''}`} onClick={() => setMenuAbierto(false)}>
                Mi Biblioteca
              </Link>
              <Link to="/purchase-history" className={`navbar-link ${estaActiva('/purchase-history') ? 'active' : ''}`} onClick={() => setMenuAbierto(false)}>
                Historial
              </Link>
              {/* El enlace de Admin solo se muestra si el usuario es administrador */}
              {usuario.rol === 'admin' && (
                <Link to="/admin/books" className={`navbar-link ${estaActiva('/admin/books') ? 'active' : ''}`} onClick={() => setMenuAbierto(false)}>
                  Admin
                </Link>
              )}
              {/* Nombre del usuario: enlace al perfil */}
              <Link to="/profile" className={`navbar-link ${estaActiva('/profile') ? 'active' : ''}`} onClick={() => setMenuAbierto(false)}>
                {usuario.nombre}
              </Link>
              {/* Botón de cerrar sesión */}
              <button onClick={() => { cerrarSesion(); setMenuAbierto(false); }} className="btn btn-outline btn-sm">
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              {/* Enlaces que solo se muestran si NO está logueado */}
              <Link to="/login" className={`navbar-link ${estaActiva('/login') ? 'active' : ''}`} onClick={() => setMenuAbierto(false)}>
                Iniciar Sesión
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm" onClick={() => setMenuAbierto(false)}>
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
