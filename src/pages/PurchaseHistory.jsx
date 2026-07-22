import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { pagosAPI } from '../services/api';
import { useToast } from '../context/ToastContext';

export default function HistorialCompras() {
  const [pagos, setPagos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const { agregarToast } = useToast();

  useEffect(() => {
    pagosAPI.getAll()
      .then(({ data }) => setPagos(data))
      .catch(() => agregarToast('No se pudo cargar tu historial de compras.', 'error'))
      .finally(() => setCargando(false));
  }, [agregarToast]);

  if (cargando) return (
    <div className="detail-loading"><div className="spinner" /><p>Cargando historial...</p></div>
  );

  return (
    <div className="history-page">
      <h1>Historial de Compras</h1>

      {pagos.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🛒</div>
          <p>No tienes compras registradas aún.</p>
          <Link to="/catalog" className="btn btn-primary">Explorar Catálogo</Link>
        </div>
      ) : (
        <div className="history-list">
          {pagos.map((pago) => (
            <div key={pago._id} className="history-card">
              <div className="history-card-icon">📖</div>
              <div className="history-card-info">
                <h3>{pago.libro?.titulo || 'Libro'}</h3>
                <p>{pago.metodoPago}</p>
                <span className="history-date">
                  {new Date(pago.fechaPago || pago.createdAt).toLocaleDateString('es', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
              <div className="history-card-amount">
                ${pago.monto.toFixed(2)} MXN
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
