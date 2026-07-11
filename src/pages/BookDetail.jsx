import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { librosAPI, resenasAPI, bibliotecaAPI, suscripcionesAPI, favoritosAPI, listaDeseosAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import LIBROS_MOCK from '../data/mockBooks';

export default function DetalleLibro() {
  const { id } = useParams();
  const { usuario, esPremium } = useAuth();
  const { agregarToast } = useToast();
  const navegar = useNavigate();
  const [libro, setLibro] = useState(null);
  const [resenas, setResenas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [puntuacion, setPuntuacion] = useState(5);
  const [comentario, setComentario] = useState('');
  const [enBiblioteca, setEnBiblioteca] = useState(false);
  const [tieneSuscripcion, setTieneSuscripcion] = useState(false);
  const [esFavorito, setEsFavorito] = useState(false);
  const [enListaDeseos, setEnListaDeseos] = useState(false);
  const [enviandoResena, setEnviandoResena] = useState(false);

  useEffect(() => {
    async function cargar() {
      try {
        const { data: datosLibro } = await librosAPI.getById(id);
        const { data: datosResenas } = await librosAPI.getReviews(id);
        setLibro(datosLibro);
        setResenas(datosResenas);
        if (usuario) {
          const { data: datosBiblio } = await bibliotecaAPI.getAll();
          setEnBiblioteca(datosBiblio.some((item) => item.book?._id === id));
          const { data: sub } = await suscripcionesAPI.getMine();
          setTieneSuscripcion(!!sub);
          const { data: datosFav } = await favoritosAPI.getAll();
          setEsFavorito(datosFav.some((f) => f.book?._id === id));
          const { data: datosWish } = await listaDeseosAPI.getAll();
          setEnListaDeseos(datosWish.some((w) => w.book?._id === id));
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

  const manejarResena = async (e) => {
    e.preventDefault();
    setEnviandoResena(true);
    try {
      const { data } = await resenasAPI.create({ bookId: id, rating: puntuacion, comment: comentario });
      setResenas((anterior) => [data, ...anterior]);
      setPuntuacion(5);
      setComentario('');
      agregarToast('Reseña publicada correctamente');
    } catch (err) {
      agregarToast(err.response?.data?.message || 'No se pudo publicar la reseña. Verifica que no hayas reseñado este libro antes.', 'error');
    } finally {
      setEnviandoResena(false);
    }
  };

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

  const manejarFavorito = async () => {
    try {
      if (esFavorito) {
        await favoritosAPI.remove(id);
        setEsFavorito(false);
        agregarToast('Eliminado de favoritos');
      } else {
        await favoritosAPI.add(id);
        setEsFavorito(true);
        agregarToast('Añadido a favoritos');
      }
    } catch (err) {
      agregarToast(err.response?.data?.message || 'No se pudo actualizar favoritos. Intenta de nuevo.', 'error');
    }
  };

  const manejarListaDeseos = async () => {
    try {
      if (enListaDeseos) {
        await listaDeseosAPI.remove(id);
        setEnListaDeseos(false);
        agregarToast('Eliminado de lista de deseos');
      } else {
        await listaDeseosAPI.add(id);
        setEnListaDeseos(true);
        agregarToast('Añadido a lista de deseos');
      }
    } catch (err) {
      agregarToast(err.response?.data?.message || 'No se pudo actualizar tu lista de deseos. Intenta de nuevo.', 'error');
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

  const calificacionPromedio = resenas.length
    ? (resenas.reduce((suma, r) => suma + r.rating, 0) / resenas.length).toFixed(1)
    : null;

  return (
    <div className="book-detail">
      <Link to="/catalog" className="back-link">← Volver al catálogo</Link>
      <div className="book-detail-header">
        <div className="book-detail-cover">
          {libro.coverUrl ? (
            <img src={libro.coverUrl} alt={libro.title} />
          ) : (
            <div className="book-card-placeholder large">{libro.title[0]}</div>
          )}
        </div>
        <div className="book-detail-info">
          <div className="book-detail-meta-top">
            <span className="book-card-genre">{libro.genre}</span>
            <span className="book-card-genre">{libro.language}</span>
            {calificacionPromedio && (
              <span className="detail-rating">★ {calificacionPromedio} ({resenas.length})</span>
            )}
          </div>
          <h1>{libro.title}</h1>
          <p className="book-detail-author">por {libro.author}</p>
          <div className="book-detail-meta">
            <span className="detail-meta-item">{libro.pages} páginas</span>
            <span className="detail-meta-divider">|</span>
            <span className="detail-meta-item">{libro.language}</span>
            <span className="detail-meta-divider">|</span>
            <span className="detail-meta-item detail-price">${libro.price?.toFixed(2)} MXN</span>
          </div>
          <p className="book-detail-desc">{libro.description}</p>
          <div className="book-detail-actions">
            {usuario && tieneSuscripcion && (
              <Link to={`/books/${id}/read`} className="btn btn-primary">Leer ahora</Link>
            )}
            {usuario && !tieneSuscripcion && esPremium && (
              <button onClick={() => navegar(`/payment/${id}`)} className="btn btn-primary">
                Comprar ${libro.price?.toFixed(2)} MXN
              </button>
            )}
            {!usuario && (
              <Link to="/login" className="btn btn-primary">Inicia sesión para leer</Link>
            )}
            {usuario && esPremium && (
              <button onClick={manejarBiblioteca} className={`btn ${enBiblioteca ? 'btn-outline' : 'btn-secondary'}`}>
                {enBiblioteca ? '✓ En tu biblioteca' : '+ Guardar'}
              </button>
            )}
            {usuario && (
              <button onClick={manejarFavorito} className={`btn ${esFavorito ? 'btn-fav-active' : 'btn-secondary'}`}>
                {esFavorito ? '❤ Favorito' : '♡ Favorito'}
              </button>
            )}
            {usuario && (
              <button onClick={manejarListaDeseos} className={`btn ${enListaDeseos ? 'btn-wish-active' : 'btn-secondary'}`}>
                {enListaDeseos ? '⭐ En lista' : '☆ Lista de deseos'}
              </button>
            )}
            {usuario && !tieneSuscripcion && !esPremium && (
              <Link to="/plans" className="btn btn-outline">Suscríbete para leer</Link>
            )}
            {!esPremium && usuario && tieneSuscripcion && (
              <span className="plan-restriction-badge">Plan Estándar — solo lectura</span>
            )}
          </div>
        </div>
      </div>

      <section className="book-detail-content">
        <h2>Sinopsis</h2>
        <p>{libro.description}</p>
        {libro.content && (
          <Link to={`/books/${id}/read`} className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>
            Leer completo
          </Link>
        )}
      </section>

      <section className="book-detail-reviews">
        <div className="reviews-header">
          <h2>Reseñas ({resenas.length})</h2>
        </div>
        {usuario && esPremium && (
          <form onSubmit={manejarResena} className="review-form">
            <div className="review-rating">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" className={`star-btn ${n <= puntuacion ? 'active' : ''}`} onClick={() => setPuntuacion(n)}>
                  ★
                </button>
              ))}
            </div>
            <textarea placeholder="¿Qué te pareció este libro?" value={comentario} onChange={(e) => setComentario(e.target.value)} rows={3} />
            <button type="submit" className="btn btn-primary" disabled={enviandoResena}>
              {enviandoResena ? 'Publicando...' : 'Publicar Reseña'}
            </button>
          </form>
        )}
        {usuario && !esPremium && (
          <p className="plan-restriction-text">Las reseñas están disponibles solo para el plan Premium.</p>
        )}
        {resenas.length === 0 ? (
          <div className="empty-state"><p>No hay reseñas aún. ¡Sé el primero en opinar!</p></div>
        ) : (
          resenas.map((resena) => (
            <div key={resena._id} className="review-card">
              <div className="review-header">
                <div className="review-user">
                  <div className="review-avatar">{resena.user?.name?.[0] || '?'}</div>
                  <strong>{resena.user?.name || 'Usuario'}</strong>
                </div>
                <span className="review-rating-stars">{'★'.repeat(resena.rating)}{'☆'.repeat(5 - resena.rating)}</span>
              </div>
              {resena.comment && <p>{resena.comment}</p>}
              <span className="review-date">
                {new Date(resena.createdAt).toLocaleDateString('es', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
