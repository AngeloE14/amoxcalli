import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Register() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const { registrarUsuario } = useAuth();
  const { agregarToast } = useToast();
  const navigate = useNavigate();

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      await registrarUsuario(nombre, correo, contrasena);
      agregarToast('¡Cuenta creada con éxito!');
      navigate('/plans');
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo crear la cuenta. El email ya podría estar en uso.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="auth-page">
      <form onSubmit={manejarEnvio} className="auth-form">
        <div className="auth-form-header">
          <div className="auth-form-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" y1="8" x2="19" y2="14" />
              <line x1="22" y1="11" x2="16" y2="11" />
            </svg>
          </div>
          <h2>Crear Cuenta</h2>
          <p>Únete a Amoxcalli y comienza a leer</p>
        </div>
        {error && <div className="error-message">{error}</div>}
        <div className="input-group">
          <label htmlFor="nombre">Nombre</label>
          <input id="nombre" type="text" placeholder="Tu nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        </div>
        <div className="input-group">
          <label htmlFor="correo-reg">Email</label>
          <input id="correo-reg" type="email" placeholder="tu@email.com" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
        </div>
        <div className="input-group">
          <label htmlFor="contrasena-reg">Contraseña</label>
          <div className="password-wrapper">
            <input id="contrasena-reg" type={mostrarContrasena ? 'text' : 'password'} placeholder="Mínimo 8 caracteres" value={contrasena} onChange={(e) => setContrasena(e.target.value)} required minLength={8} />
            <button type="button" className="password-toggle" onClick={() => setMostrarContrasena(!mostrarContrasena)} tabIndex={-1}>
              {mostrarContrasena ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                  <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>
        <button type="submit" className="btn btn-primary" disabled={cargando}>
          {cargando ? 'Creando cuenta...' : 'Crear Cuenta'}
        </button>
        <p className="auth-link">¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
      </form>
    </div>
  );
}
