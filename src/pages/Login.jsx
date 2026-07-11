import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const { iniciarSesion } = useAuth();
  const { agregarToast } = useToast();
  const navigate = useNavigate();

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      await iniciarSesion(correo, contrasena);
      agregarToast('¡Bienvenido de vuelta!');
      navigate('/catalog');
    } catch (err) {
      setError(err.response?.data?.message || 'Credenciales incorrectas. Verifica tu email y contraseña.');
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
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
          </div>
          <h2>Iniciar Sesión</h2>
          <p>Ingresa tus credenciales para continuar</p>
        </div>
        {error && <div className="error-message">{error}</div>}
        <div className="input-group">
          <label htmlFor="correo">Email</label>
          <input id="correo" type="email" placeholder="tu@email.com" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
        </div>
        <div className="input-group">
          <label htmlFor="contrasena">Contraseña</label>
          <div className="password-wrapper">
            <input id="contrasena" type={mostrarContrasena ? 'text' : 'password'} placeholder="••••••••" value={contrasena} onChange={(e) => setContrasena(e.target.value)} required />
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
          {cargando ? 'Entrando...' : 'Entrar'}
        </button>
        <p className="auth-link">¿No tienes cuenta? <Link to="/register">Regístrate</Link></p>
      </form>
    </div>
  );
}
