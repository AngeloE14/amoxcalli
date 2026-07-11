import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { favoritosAPI } from '../services/api';
import TarjetaLibro from '../components/BookCard';
import { useToast } from '../context/ToastContext';

export default function Favoritos() {
  const [favoritos, setFavoritos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const { agregarToast } = useToast();

  useEffect(() => {
    favoritosAPI.getAll()
      .then(({ data }) => setFavoritos(data))
      .catch(() => agregarToast('No se pudieron cargar tus favoritos.', 'error'))
      .finally(() => setCargando(false));
  }, [agregarToast]);

  if (cargando) return (
    <div className="detail-loading"><div className="spinner" /><p>Cargando favoritos...</p></div>
  );

  return (
    <div className="favorites-page">
      <h1>Mis Favoritos</h1>
      {favoritos.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">❤️</div>
          <p>No tienes libros favoritos aún.</p>
          <Link to="/catalog" className="btn btn-primary">Explorar Catálogo</Link>
        </div>
      ) : (
        <>
          <p className="library-count">{favoritos.length} favorito{favoritos.length !== 1 ? 's' : ''}</p>
          <div className="books-grid">
            {favoritos.map((fav) => (
              <TarjetaLibro key={fav._id} book={fav.book} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
