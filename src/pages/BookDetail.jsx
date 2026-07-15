import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { librosAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import LIBROS_MOCK from '../data/mockBooks';

// Helpers para leer/escribir la biblioteca en localStorage
function obtenerBiblioteca() {
  return JSON.parse(localStorage.getItem('biblioteca') || '[]');
}

function guardarBiblioteca(items) {
  localStorage.setItem('biblioteca', JSON.stringify(items));
}

export default function DetalleLibro() {
  const { id } = useParams();
  const { usuario } = useAuth();
  const { agregarToast } = useToast();
  const [libro, setLibro] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [enBiblioteca, setEnBiblioteca] = useState(false);

  // Cargar datos del libro desde la API
  useEffect(() => {
    async function cargar() {
      try {
        const { data: datosLibro } = await librosAPI.getById(id);
        setLibro(datosLibro);
      } catch {
        const mock = LIBROS_MOCK.find((l) => l._id === id);
        if (mock) setLibro(mock);
        else agregarToast('No se pudo cargar la información del libro. Intenta de nuevo.', 'error');
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, [id, agregarToast]);

  // Verificar si el libro ya está guardado en la biblioteca del usuario
  useEffect(() => {
    if (libro) {
      const biblio = obtenerBiblioteca();
      setEnBiblioteca(biblio.some((item) => item.libro?._id === id));
    }
  }, [id, libro]);

  // Agregar o quitar libro de la biblioteca (localStorage)
  const manejarBiblioteca = () => {
    const biblio = obtenerBiblioteca();
    if (enBiblioteca) {
      // Si ya está guardado, lo elimina
      guardarBiblioteca(biblio.filter((item) => item.libro?._id !== id));
      setEnBiblioteca(false);
      agregarToast('Libro eliminado de tu biblioteca');
    } else {
      // Si no está, lo agrega con tipoCompra 'subscription' (guardado, no comprado)
      biblio.push({
        _id: 'bib_' + Date.now(), // ID temporal para key de React
        libro,
        tipoCompra: 'subscription',
        createdAt: new Date().toISOString(),
      });
      guardarBiblioteca(biblio);
      setEnBiblioteca(true);
      agregarToast('Libro guardado en tu biblioteca');
    }
  };

  if (cargando) return (
    <div className="detail-loading"><div className="spinner" /><p>Cargando libro...</p></div>
  );

  if (!libro) return (
    <div className="empty-state">
      <p>Libro no encontrado.</p>
      <Link to="/catalog" className="btn btn-primary">Volver al catálogo</Link>
    </div>
  );

  return (
    <div className="book-detail">
      <Link to="/catalog" className="back-link">← Volver al catálogo</Link>
      <div className="book-detail-header">
        <div className="book-detail-cover">
          {libro.portada ? (
            <img src={libro.portada} alt={libro.titulo} />
          ) : (
            <div className="book-card-placeholder large">{libro.titulo[0]}</div>
          )}
        </div>
        <div className="book-detail-info">
          <div className="book-detail-meta-top">
            <span className="book-card-genre">{libro.genero}</span>
            <span className="book-card-genre">{libro.idioma}</span>
          </div>
          <h1>{libro.titulo}</h1>
          <p className="book-detail-author">por {libro.autor}</p>
          <div className="book-detail-meta">
            <span className="detail-meta-item">{libro.paginas} páginas</span>
            <span className="detail-meta-divider">|</span>
            <span className="detail-meta-item">{libro.idioma}</span>
            <span className="detail-meta-divider">|</span>
            <span className="detail-meta-item detail-price">${libro.precio?.toFixed(2)} MXN</span>
          </div>
          <p className="book-detail-desc">{libro.descripcion}</p>
          <div className="book-detail-actions">
            {usuario && (
              <Link to={`/books/${id}/read`} className="btn btn-primary">
                Leer libro
              </Link>
            )}
            {usuario && !enBiblioteca && (
              <Link to={`/payment/${id}`} className="btn btn-secondary">
                Comprar libro
              </Link>
            )}
            {usuario && (
              <button onClick={manejarBiblioteca} className={`btn ${enBiblioteca ? 'btn-outline' : 'btn-outline'}`}>
                {enBiblioteca ? '✓ En tu biblioteca' : '+ Guardar'}
              </button>
            )}
            {!usuario && (
              <Link to="/login" className="btn btn-primary">Inicia sesión para leer</Link>
            )}
          </div>
        </div>
      </div>

      <section className="book-detail-content">
        <h2>Sinopsis</h2>
        <p>{libro.descripcion}</p>
      </section>
    </div>
  );
}
