import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const ContextoAuth = createContext();

export function ProveedorAuth({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [planActual, setPlanActual] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Al cargar la app, recuperar usuario y plan de localStorage si existe sesión
  useEffect(() => {
    const token = localStorage.getItem('token');
    const usuarioGuardado = localStorage.getItem('usuario');
    if (token && usuarioGuardado) {
      const user = JSON.parse(usuarioGuardado);
      setUsuario(user);
      setPlanActual(user.plan || null); // El plan se guarda dentro del objeto usuario
    }
    setCargando(false);
  }, []);

  const iniciarSesion = async (correo, contrasena) => {
    const { data } = await authAPI.login({ correo, contraseña: contrasena });
    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data.user));
    setUsuario(data.user);
    setPlanActual(data.user.plan || null);
    return data;
  };

  const registrarUsuario = async (nombre, correo, contrasena) => {
    const { data } = await authAPI.register({ nombre, correo, contraseña: contrasena });
    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data.user));
    setUsuario(data.user);
    setPlanActual(data.user.plan || null);
    return data;
  };

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
    setPlanActual(null);
  };

  const actualizarUsuario = (datos) => {
    const actualizado = { ...usuario, ...datos };
    localStorage.setItem('usuario', JSON.stringify(actualizado));
    setUsuario(actualizado);
    if (datos.plan !== undefined) setPlanActual(datos.plan);
  };

  // Cambiar plan: primero guardar en el backend, luego sincronizar localStorage
  const seleccionarPlan = async (planId) => {
    await authAPI.updateProfile({ plan: planId }); // PUT /api/auth/profile con el plan
    const actualizado = { ...usuario, plan: planId };
    localStorage.setItem('usuario', JSON.stringify(actualizado));
    setUsuario(actualizado);
    setPlanActual(planId);
  };

  const esPremium = planActual === 'premium';

  return (
    <ContextoAuth.Provider value={{ usuario, iniciarSesion, registrarUsuario, cerrarSesion, actualizarUsuario, cargando, planActual, seleccionarPlan, esPremium }}>
      {children}
    </ContextoAuth.Provider>
  );
}

export const useAuth = () => useContext(ContextoAuth);
