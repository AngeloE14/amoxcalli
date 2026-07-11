import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { listaDeseosAPI } from '../services/api';
import TarjetaLibro from '../components/BookCard';
import { useToast } from '../context/ToastContext';

export default function ListaDeseos() {
  const [elementos, setElementos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const { agregarToast } = useToast();

  useEffect(() => {
    listaDeseosAPI.getAll()
      .then(({ data }) => setElementos(data))
      .catch(() => agregarToast('No se pudo cargar tu lista de deseos.', 'error'))
      .finally(() => setCargando(false));
  }, [agregarToast]);

  if (cargando) return (
    <div className="detail-loading"><div className="spinner" /><p>Cargando lista de deseos...</p></div>
  );

  return (
    <div className="wishlist-page">
      <h1>Lista de Deseos</h1>
      {elementos.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">⭐</div>
          <p>Tu lista de deseos está vacía.</p>
          <Link to="/catalog" className="btn btn-primary">Explorar Catálogo</Link>
        </div>
      ) : (
        <>
          <p className="library-count">{elementos.length} libro{elementos.length !== 1 ? 's' : ''} en tu lista</p>
          <div className="books-grid">
            {elementos.map((item) => (
              <TarjetaLibro key={item._id} book={item.book} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
