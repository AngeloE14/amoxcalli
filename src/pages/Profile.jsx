import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authAPI } from '../services/api';

// Planes disponibles (deben coincidir con los IDs que maneja el backend)
const PLANES = [
  { id: 'standard', nombre: 'Estándar', precio: 79.99, descripcion: 'Acceso a hasta 5 libros por 3 meses.' },
  { id: 'premium', nombre: 'Premium', precio: 149.99, descripcion: 'Acceso ilimitado a todo el catálogo por 3 meses.' },
];

export default function Perfil() {
  const { usuario, actualizarUsuario, cerrarSesion, planActual, seleccionarPlan } = useAuth();
  const { agregarToast } = useToast();
  const navegar = useNavigate();
  const [correo, setCorreo] = useState(usuario?.correo || '');
  const [contrasenaActual, setContrasenaActual] = useState('');
  const [contrasenaNueva, setContrasenaNueva] = useState('');
  const [mostrarActual, setMostrarActual] = useState(false);
  const [mostrarNueva, setMostrarNueva] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [cargandoEliminar, setCargandoEliminar] = useState(false);

  // Un solo formulario que maneja correo y contraseña por separado
  const manejarEnvio = async (e) => {
    e.preventDefault();
    setCargando(true);
    try {
      // Solo actualizar perfil si el correo cambió
      if (correo !== usuario?.correo) {
        const { data } = await authAPI.updateProfile({ nombre: usuario.nombre, correo });
        actualizarUsuario({ correo: data.correo });
      }
      // Solo cambiar contraseña si ambos campos están llenos
      if (contrasenaActual && contrasenaNueva) {
        await authAPI.changePassword({ contraseñaActual: contrasenaActual, contraseñaNueva: contrasenaNueva });
        setContrasenaActual('');
        setContrasenaNueva('');
        agregarToast('Perfil y contraseña actualizados');
      } else {
        agregarToast('Perfil actualizado correctamente');
      }
    } catch (err) {
      agregarToast(err.response?.data?.message || 'No se pudieron guardar los cambios.', 'error');
    } finally {
      setCargando(false);
    }
  };

  // Cambiar plan tanto en el backend (MongoDB) como en localStorage
  const cambiarPlan = async (planId) => {
    try {
      await seleccionarPlan(planId); // Llama a PUT /api/auth/profile con el nuevo plan
      agregarToast(`Plan cambiado a ${PLANES.find((p) => p.id === planId).nombre}`);
    } catch {
      agregarToast('No se pudo cambiar el plan. Intenta de nuevo.', 'error');
    }
  };

  const eliminarCuenta = async () => {
    setCargandoEliminar(true);
    try {
      await authAPI.deleteAccount();
      cerrarSesion();
      agregarToast('Cuenta eliminada correctamente');
      navegar('/');
    } catch (err) {
      agregarToast(err.response?.data?.message || 'No se pudo eliminar la cuenta.', 'error');
    } finally {
      setCargandoEliminar(false);
      setMostrarConfirmacion(false);
    }
  };

  return (
    <div className="profile-page">
      <h1>Mi Perfil</h1>
      <div className="profile-section">
        <h2>Información personal</h2>
        <form onSubmit={manejarEnvio} className="auth-form" style={{ maxWidth: '100%' }}>
          <div className="input-group">
            <label htmlFor="nombre-perfil">Nombre</label>
            <input id="nombre-perfil" type="text" value={usuario?.nombre || ''} disabled />
          </div>
          <div className="input-group">
            <label htmlFor="correo-perfil">Correo electrónico</label>
            <input id="correo-perfil" type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Rol</label>
            <input type="text" value={usuario?.rol === 'admin' ? 'Administrador' : 'Usuario'} disabled />
          </div>
          <hr style={{ border: '0', borderTop: '1px solid var(--border)', margin: '0.5rem 0 1rem' }} />
          <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Cambiar contraseña</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '1rem' }}>Deja en blanco si no quieres cambiarla.</p>
          <div className="input-group">
            <label htmlFor="contrasena-actual">Contraseña actual</label>
            <div className="password-wrapper">
              <input id="contrasena-actual" type={mostrarActual ? 'text' : 'password'} value={contrasenaActual} onChange={(e) => setContrasenaActual(e.target.value)} />
              <button type="button" className="password-toggle" onClick={() => setMostrarActual(!mostrarActual)} tabIndex={-1}>
                {mostrarActual ? (
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
          <div className="input-group">
            <label htmlFor="contrasena-nueva">Nueva contraseña</label>
            <div className="password-wrapper">
              <input id="contrasena-nueva" type={mostrarNueva ? 'text' : 'password'} value={contrasenaNueva} onChange={(e) => setContrasenaNueva(e.target.value)} minLength={8} />
              <button type="button" className="password-toggle" onClick={() => setMostrarNueva(!mostrarNueva)} tabIndex={-1}>
                {mostrarNueva ? (
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
            {cargando ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </form>
      </div>

      <div className="profile-section">
        <h2>Mi plan</h2>
        <div className="profile-plans">
          {PLANES.map((plan) => (
            <div key={plan.id} className={`profile-plan-card ${planActual === plan.id ? 'active' : ''}`}>
              <div>
                <h3>{plan.nombre}</h3>
                <p className="profile-plan-price">${plan.precio} MXN / 3 meses</p>
                <p className="profile-plan-desc">{plan.descripcion}</p>
              </div>
              {planActual === plan.id ? (
                <span className="btn btn-outline" style={{ opacity: 0.6, cursor: 'default' }}>Plan actual</span>
              ) : (
                <button className="btn btn-secondary" onClick={() => cambiarPlan(plan.id)}>Cambiar a este</button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="profile-section" style={{ borderColor: '#e74c3c' }}>
        <h2 style={{ color: '#e74c3c' }}>Zona de peligro</h2>
        <p>Eliminar tu cuenta es permanente. No podrás recuperar tus datos.</p>
        <button type="button" className="btn btn-danger" onClick={() => setMostrarConfirmacion(true)}>
          Eliminar mi cuenta
        </button>
      </div>

      {mostrarConfirmacion && (
        <div className="modal-overlay" onClick={() => setMostrarConfirmacion(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>¿Estás seguro?</h3>
            <p>Esta acción eliminará tu cuenta permanentemente y no se puede deshacer.</p>
            <div className="modal-actions">
              <button type="button" className="btn btn-outline" onClick={() => setMostrarConfirmacion(false)} disabled={cargandoEliminar}>
                Cancelar
              </button>
              <button type="button" className="btn btn-danger" onClick={eliminarCuenta} disabled={cargandoEliminar}>
                {cargandoEliminar ? 'Eliminando...' : 'Sí, eliminar mi cuenta'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
