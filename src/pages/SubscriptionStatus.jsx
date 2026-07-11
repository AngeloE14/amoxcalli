import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { suscripcionesAPI } from '../services/api';
import { useToast } from '../context/ToastContext';

export default function EstadoSuscripcion() {
  const [suscripcion, setSuscripcion] = useState(null);
  const [cargando, setCargando] = useState(true);
  const { agregarToast } = useToast();

  useEffect(() => {
    suscripcionesAPI.getMine()
      .then(({ data }) => setSuscripcion(data))
      .catch(() => agregarToast('No se pudo verificar tu suscripción.', 'error'))
      .finally(() => setCargando(false));
  }, [agregarToast]);

  if (cargando) return (
    <div className="detail-loading"><div className="spinner" /><p>Cargando...</p></div>
  );

  return (
    <div className="sub-status-page">
      <h1>Mi Suscripción</h1>
      {suscripcion ? (
        <div className="sub-status-card">
          <div className="sub-status-active">
            <span className="sub-status-badge active">Activa</span>
          </div>
          <h2>{suscripcion.plan?.name}</h2>
          <p className="sub-status-price">${suscripcion.plan?.price?.toFixed(2)} MXN / 3 meses</p>
          <div className="sub-status-details">
            <div className="sub-detail">
              <span className="sub-detail-label">Fecha de inicio</span>
              <span>{new Date(suscripcion.startDate).toLocaleDateString('es', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="sub-detail">
              <span className="sub-detail-label">Fecha de vencimiento</span>
              <span>{new Date(suscripcion.endDate).toLocaleDateString('es', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="sub-detail">
              <span className="sub-detail-label">Días restantes</span>
              <span>{Math.max(0, Math.ceil((new Date(suscripcion.endDate) - new Date()) / (1000 * 60 * 60 * 24)))} días</span>
            </div>
          </div>
          <Link to="/catalog" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>Explorar Catálogo</Link>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <p>No tienes una suscripción activa.</p>
          <Link to="/plans" className="btn btn-primary">Ver Planes Disponibles</Link>
        </div>
      )}
    </div>
  );
}
