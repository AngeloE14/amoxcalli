import { createContext, useContext, useState, useCallback } from 'react';

const ContextoToast = createContext();
let contadorId = 0;

export function ProveedorToast({ children }) {
  const [mensajes, setMensajes] = useState([]);

  const agregarToast = useCallback((mensaje, tipo = 'exito') => {
    const id = ++contadorId;
    setMensajes((anterior) => [...anterior, { id, mensaje, tipo }]);
    setTimeout(() => {
      setMensajes((anterior) => anterior.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ContextoToast.Provider value={{ agregarToast }}>
      {children}
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

export const useToast = () => useContext(ContextoToast);
