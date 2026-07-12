import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { librosAPI, bibliotecaAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import LIBROS_MOCK from '../data/mockBooks';

export default function DetalleLibro() {
  const { id } = useParams();
  const { usuario } = useAuth();
  const { agregarToast } = useToast();
  const [libro, setLibro] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [enBiblioteca, setEnBiblioteca] = useState(false);

  useEffect(() => {
    async function cargar() {
      try {
        const { data: datosLibro } = await librosAPI.getById(id);
        setLibro(datosLibro);
        if (usuario) {
          const { data: datosBiblio } = await bibliotecaAPI.getAll();
          setEnBiblioteca(datosBiblio.some((item) => item.libro?._id === id));
        }
      } catch {
        const mock = LIBROS_MOCK.find((l) => l._id === id);
        if (mock) setLibro(mock);
        else agregarToast('No se pudo cargar la información del libro. Intenta de nuevo.', 'error');
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, [id, usuario, agregarToast]);

  const manejarBiblioteca = async () => {
    try {
      if (enBiblioteca) {
        await bibliotecaAPI.remove(id);
        setEnBiblioteca(false);
        agregarToast('Libro eliminado de tu biblioteca');
      } else {
        await bibliotecaAPI.add(id, 'subscription');
        setEnBiblioteca(true);
        agregarToast('Libro guardado en tu biblioteca');
      }
    } catch (err) {
      agregarToast(err.response?.data?.message || 'No se pudo modificar tu biblioteca. Intenta de nuevo.', 'error');
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
              <button onClick={manejarBiblioteca} className={`btn ${enBiblioteca ? 'btn-outline' : 'btn-secondary'}`}>
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
