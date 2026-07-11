import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { resenasAPI } from '../services/api';
import { useToast } from '../context/ToastContext';

export default function MisResenas() {
  const [resenas, setResenas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const { agregarToast } = useToast();

  useEffect(() => {
    resenasAPI.getMine()
      .then(({ data }) => setResenas(data))
      .catch(() => agregarToast('No se pudieron cargar tus reseñas.', 'error'))
      .finally(() => setCargando(false));
  }, [agregarToast]);

  const manejarEliminar = async (id) => {
    try {
      await resenasAPI.delete(id);
      setResenas((anterior) => anterior.filter((r) => r._id !== id));
      agregarToast('Reseña eliminada');
    } catch {
      agregarToast('No se pudo eliminar la reseña. Intenta de nuevo.', 'error');
    }
  };

  if (cargando) return (
    <div className="detail-loading"><div className="spinner" /><p>Cargando reseñas...</p></div>
  );

  return (
    <div className="reviews-page">
      <h1>Mis Reseñas</h1>
      {resenas.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">⭐</div>
          <p>No has escrito ninguna reseña aún.</p>
          <Link to="/catalog" className="btn btn-primary">Explorar Catálogo</Link>
        </div>
      ) : (
        resenas.map((resena) => (
          <div key={resena._id} className="review-card">
            <div className="review-header">
              <div className="review-user">
                <strong>{resena.book?.title || 'Libro'}</strong>
              </div>
              <span className="review-rating-stars">{'★'.repeat(resena.rating)}{'☆'.repeat(5 - resena.rating)}</span>
            </div>
            {resena.comment && <p>{resena.comment}</p>}
            <div className="review-footer">
              <span className="review-date">
                {new Date(resena.createdAt).toLocaleDateString('es', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
              <button onClick={() => manejarEliminar(resena._id)} className="btn btn-sm btn-danger">Eliminar</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
