import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const ContextoAuth = createContext();

export function ProveedorAuth({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [planActual, setPlanActual] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const usuarioGuardado = localStorage.getItem('usuario');
    const planGuardado = localStorage.getItem('planActual');
    if (token && usuarioGuardado) setUsuario(JSON.parse(usuarioGuardado));
    if (planGuardado) setPlanActual(planGuardado);
    setCargando(false);
  }, []);

  const iniciarSesion = async (correo, contrasena) => {
    const { data } = await authAPI.login({ email: correo, password: contrasena });
    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data.user));
    setUsuario(data.user);
    return data;
  };

  const registrarUsuario = async (nombre, correo, contrasena) => {
    const { data } = await authAPI.register({ name: nombre, email: correo, password: contrasena });
    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data.user));
    setUsuario(data.user);
    return data;
  };

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('planActual');
    setUsuario(null);
    setPlanActual(null);
  };

  const actualizarUsuario = (datos) => {
    const actualizado = { ...usuario, ...datos };
    localStorage.setItem('usuario', JSON.stringify(actualizado));
    setUsuario(actualizado);
  };

  const seleccionarPlan = (planId) => {
    localStorage.setItem('planActual', planId);
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
