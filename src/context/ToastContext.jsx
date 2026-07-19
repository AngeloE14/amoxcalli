// ============================================================
// src/context/ToastContext.jsx — Proveedor de Notificaciones Toast
// ============================================================
// Sistema de notificaciones emergentes (popups informativos).
// Muestra mensajes de éxito o error que desaparecen automáticamente
// después de 3 segundos. Se usa en toda la aplicación con useToast().

import { createContext, useContext, useState, useCallback } from 'react';

// Crear el contexto para las notificaciones
const ContextoToast = createContext();
let contadorId = 0; // ID autoincremental para identificar cada toast

export function ProveedorToast({ children }) {
  const [mensajes, setMensajes] = useState([]); // Lista de toasts visibles

  // ============================================================
  // agregarToast: Agrega un nuevo mensaje a la lista
  // Se auto-elimina después de 3 segundos
  // tipo: 'exito' (verde) o 'error' (rojo)
  // ============================================================
  const agregarToast = useCallback((mensaje, tipo = 'exito') => {
    const id = ++contadorId;
    setMensajes((anterior) => [...anterior, { id, mensaje, tipo }]);
    // Programar eliminación automática después de 3 segundos
    setTimeout(() => {
      setMensajes((anterior) => anterior.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ContextoToast.Provider value={{ agregarToast }}>
      {children}
      {/* Contenedor de toasts: aparece fijo en la esquina inferior derecha */}
      <div className="toast-container">
        {mensajes.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.tipo}`}>
            <span className="toast-icon">{toast.tipo === 'exito' ? '✓' : '✕'}</span>
            {toast.mensaje}
          </div>
        ))}
      </div>
    </ContextoToast.Provider>
  );
}

// Hook personalizado para usar los toasts desde cualquier componente
export const useToast = () => useContext(ContextoToast);
