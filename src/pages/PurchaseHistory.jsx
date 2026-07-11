import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { transaccionesAPI } from '../services/api';
import { useToast } from '../context/ToastContext';

export default function HistorialCompras() {
  const [transacciones, setTransacciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const { agregarToast } = useToast();

  useEffect(() => {
    transaccionesAPI.getAll()
      .then(({ data }) => setTransacciones(data))
      .catch(() => agregarToast('No se pudo cargar tu historial de compras.', 'error'))
      .finally(() => setCargando(false));
  }, [agregarToast]);

  if (cargando) return (
    <div className="detail-loading"><div className="spinner" /><p>Cargando historial...</p></div>
  );

  return (
    <div className="history-page">
      <h1>Historial de Compras</h1>
      {transacciones.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🛒</div>
          <p>No tienes compras registradas aún.</p>
          <Link to="/catalog" className="btn btn-primary">Explorar Catálogo</Link>
        </div>
      ) : (
        <div className="history-list">
          {transacciones.map((transaccion) => (
            <div key={transaccion._id} className="history-card">
              <div className="history-card-icon">
                {transaccion.type === 'subscription' ? '📋' : '📖'}
              </div>
              <div className="history-card-info">
                <h3>{transaccion.description}</h3>
                <p>{transaccion.paymentMethod}</p>
                <span className="history-date">
                  {new Date(transaccion.createdAt).toLocaleDateString('es', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
              <div className="history-card-amount">
                ${transaccion.amount.toFixed(2)} MXN
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
