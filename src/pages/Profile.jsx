import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authAPI } from '../services/api';

export default function Perfil() {
  const { usuario, actualizarUsuario } = useAuth();
  const { agregarToast } = useToast();
  const [nombre, setNombre] = useState(usuario?.name || '');
  const [correo, setCorreo] = useState(usuario?.email || '');
  const [contrasenaActual, setContrasenaActual] = useState('');
  const [contrasenaNueva, setContrasenaNueva] = useState('');
  const [cargandoPerfil, setCargandoPerfil] = useState(false);
  const [cargandoContrasena, setCargandoContrasena] = useState(false);

  const manejarPerfil = async (e) => {
    e.preventDefault();
    setCargandoPerfil(true);
    try {
      const { data } = await authAPI.updateProfile({ name: nombre, email: correo });
      actualizarUsuario({ name: data.name, email: data.email });
      agregarToast('Perfil actualizado correctamente');
    } catch (err) {
      agregarToast(err.response?.data?.message || 'No se pudo actualizar tu perfil. Verifica los datos.', 'error');
    } finally {
      setCargandoPerfil(false);
    }
  };

  const manejarContrasena = async (e) => {
    e.preventDefault();
    setCargandoContrasena(true);
    try {
      await authAPI.changePassword({ currentPassword: contrasenaActual, newPassword: contrasenaNueva });
      setContrasenaActual('');
      setContrasenaNueva('');
      agregarToast('Contraseña cambiada correctamente');
    } catch (err) {
      agregarToast(err.response?.data?.message || 'No se pudo cambiar la contraseña. Verifica que la actual sea correcta.', 'error');
    } finally {
      setCargandoContrasena(false);
    }
  };

  return (
    <div className="profile-page">
      <h1>Mi Perfil</h1>
      <div className="profile-section">
        <h2>Información personal</h2>
        <form onSubmit={manejarPerfil} className="auth-form" style={{ maxWidth: '100%' }}>
          <div className="input-group">
            <label htmlFor="nombre-perfil">Nombre</label>
            <input id="nombre-perfil" type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          </div>
          <div className="input-group">
            <label htmlFor="correo-perfil">Email</label>
            <input id="correo-perfil" type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Rol</label>
            <input type="text" value={usuario?.role === 'admin' ? 'Administrador' : 'Usuario'} disabled />
          </div>
          <button type="submit" className="btn btn-primary" disabled={cargandoPerfil}>
            {cargandoPerfil ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </form>
      </div>
      <div className="profile-section">
        <h2>Cambiar contraseña</h2>
        <form onSubmit={manejarContrasena} className="auth-form" style={{ maxWidth: '100%' }}>
          <div className="input-group">
            <label htmlFor="contrasena-actual">Contraseña actual</label>
            <input id="contrasena-actual" type="password" value={contrasenaActual} onChange={(e) => setContrasenaActual(e.target.value)} required />
          </div>
          <div className="input-group">
            <label htmlFor="contrasena-nueva">Nueva contraseña</label>
            <input id="contrasena-nueva" type="password" value={contrasenaNueva} onChange={(e) => setContrasenaNueva(e.target.value)} required minLength={6} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={cargandoContrasena}>
            {cargandoContrasena ? 'Cambiando...' : 'Cambiar Contraseña'}
          </button>
        </form>
      </div>
    </div>
  );
}
