import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { usuario, cerrarSesion } = useAuth();
  const ubicacion = useLocation();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const estaActiva = (ruta) => ubicacion.pathname === ruta;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="navbar-brand-icon">B</span>
          Amoxcalli
        </Link>
        <button className={`navbar-toggle ${menuAbierto ? 'open' : ''}`} onClick={() => setMenuAbierto(!menuAbierto)} aria-label="Menú">
          <span /><span /><span />
        </button>
        <div className={`navbar-links ${menuAbierto ? 'show' : ''}`}>
          <Link to="/catalog" className={`navbar-link ${estaActiva('/catalog') ? 'active' : ''}`} onClick={() => setMenuAbierto(false)}>
            Catálogo
          </Link>
          <Link to="/plans" className={`navbar-link ${estaActiva('/plans') ? 'active' : ''}`} onClick={() => setMenuAbierto(false)}>
            Planes
          </Link>
          {usuario ? (
            <>
              <Link to="/library" className={`navbar-link ${estaActiva('/library') ? 'active' : ''}`} onClick={() => setMenuAbierto(false)}>
                Mi Biblioteca
              </Link>
              <Link to="/purchase-history" className={`navbar-link ${estaActiva('/purchase-history') ? 'active' : ''}`} onClick={() => setMenuAbierto(false)}>
                Historial
              </Link>
              {usuario.rol === 'admin' && (
                <Link to="/admin/books" className={`navbar-link ${estaActiva('/admin/books') ? 'active' : ''}`} onClick={() => setMenuAbierto(false)}>
                  Admin
                </Link>
              )}
              <Link to="/profile" className={`navbar-link ${estaActiva('/profile') ? 'active' : ''}`} onClick={() => setMenuAbierto(false)}>
                {usuario.nombre}
              </Link>
              <button onClick={() => { cerrarSesion(); setMenuAbierto(false); }} className="btn btn-outline btn-sm">
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
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
