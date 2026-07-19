// ============================================================
// src/context/AuthContext.jsx — Proveedor de Estado de Autenticación
// ============================================================
// React Context que maneja TODO lo relacionado con la sesión del usuario:
// - Guardar/recuperar sesión del localStorage
// - Login, registro y logout
// - Cambiar plan de suscripción
// - Actualizar datos del perfil
// Cualquier componente puede usar estos datos con useAuth()

import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

// Crear el contexto (un "contenedor" de datos compartidos)
const ContextoAuth = createContext();

export function ProveedorAuth({ children }) {
  const [usuario, setUsuario] = useState(null);      // Objeto del usuario logueado (o null si no hay sesión)
  const [planActual, setPlanActual] = useState(null); // Plan actual del usuario ('standard', 'premium' o null)
  const [cargando, setCargando] = useState(true);     // true mientras se verifica si hay sesión guardada

  // ============================================================
  // Al cargar la app, recuperar sesión del localStorage si existe
  // Esto permite que el usuario no tenga que loguearse cada vez que recarga la página
  // ============================================================
  useEffect(() => {
    const token = localStorage.getItem('token');
    const usuarioGuardado = localStorage.getItem('usuario');
    if (token && usuarioGuardado) {
      const user = JSON.parse(usuarioGuardado);
      setUsuario(user);
      setPlanActual(user.plan || null); // El plan se guarda dentro del objeto usuario
    }
    setCargando(false); // Ya se verificó, puede renderizar la app
  }, []);

  // ============================================================
  // iniciarSesion: Llama al backend con correo+contraseña
  // Guarda el token y usuario en localStorage y en el estado
  // ============================================================
  const iniciarSesion = async (correo, contrasena) => {
    const { data } = await authAPI.login({ correo, contraseña: contrasena });
    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data.user));
    setUsuario(data.user);
    setPlanActual(data.user.plan || null);
    return data;
  };

  // ============================================================
  // registrarUsuario: Crea una cuenta nueva y loguea automáticamente
  // ============================================================
  const registrarUsuario = async (nombre, correo, contrasena) => {
    const { data } = await authAPI.register({ nombre, correo, contraseña: contrasena });
    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data.user));
    setUsuario(data.user);
    setPlanActual(data.user.plan || null);
    return data;
  };

  // ============================================================
  // cerrarSesion: Limpia todo el estado y el localStorage
  // ============================================================
  const cerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
    setPlanActual(null);
  };

  // ============================================================
  // actualizarUsuario: Actualiza los datos del usuario en estado y localStorage
  // Se usa cuando el usuario cambia su correo, nombre, etc.
  // ============================================================
  const actualizarUsuario = (datos) => {
    const actualizado = { ...usuario, ...datos };
    localStorage.setItem('usuario', JSON.stringify(actualizado));
    setUsuario(actualizado);
    if (datos.plan !== undefined) setPlanActual(datos.plan);
  };

  // ============================================================
  // seleccionarPlan: Cambia el plan de suscripción del usuario
  // Primero guarda en MongoDB (backend), luego sincroniza localStorage
  // ============================================================
  const seleccionarPlan = async (planId) => {
    await authAPI.updateProfile({ plan: planId }); // PUT /api/auth/profile con el plan
    const actualizado = { ...usuario, plan: planId };
    localStorage.setItem('usuario', JSON.stringify(actualizado));
    setUsuario(actualizado);
    setPlanActual(planId);
  };

  // Flag computado: true si el usuario tiene plan premium
  const esPremium = planActual === 'premium';

  // Provider: expone todo el estado y funciones a toda la aplicación
  return (
    <ContextoAuth.Provider value={{ usuario, iniciarSesion, registrarUsuario, cerrarSesion, actualizarUsuario, cargando, planActual, seleccionarPlan, esPremium }}>
      {children}
    </ContextoAuth.Provider>
  );
}

// Hook personalizado para usar la autenticación desde cualquier componente
export const useAuth = () => useContext(ContextoAuth);
