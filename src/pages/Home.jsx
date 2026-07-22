import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { librosAPI } from '../services/api';
import TarjetaLibro from '../components/BookCard';
import LIBROS_MOCK from '../data/mockBooks';

export default function Inicio() {
  const { usuario } = useAuth();
  const [destacados, setDestacados] = useState([]);

  useEffect(() => {
    librosAPI.getAll({ sort: 'newest' })
      .then(({ data }) => setDestacados(data.slice(0, 4)))
      .catch(() => setDestacados(LIBROS_MOCK.slice(0, 4)));
  }, []);

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero-section">
        <div className="hero-bg-shapes">
          <div className="shape shape-1" />
          <div className="shape shape-2" />
          <div className="shape shape-3" />
          <div className="shape shape-4" />
        </div>
        <div className="hero-content">
          <div className="hero-badge">Plataforma de lectura digital</div>
          <h1>Tu biblioteca<br />sin limites</h1>
          <p className="hero-subtitle">
            Explora un catalogo de libros de todos los generos.
            Suscribete o compra individualmente. Lee cuando quieras, donde quieras.
          </p>
          <div className="hero-actions">
            {usuario ? (
              <Link to="/catalog" className="btn btn-primary btn-lg">Explorar Catalogo</Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">Comenzar Ahora</Link>
                <Link to="/catalog" className="btn btn-outline btn-lg">Ver Catalogo</Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="home-how">
        <h2>Como funciona</h2>
        <div className="home-how-grid">
          <div className="home-how-step">
            <div className="home-how-number">1</div>
            <h3>Crea tu cuenta</h3>
            <p>Registrate gratis en segundos y accede a la plataforma.</p>
          </div>
          <div className="home-how-arrow">→</div>
          <div className="home-how-step">
            <div className="home-how-number">2</div>
            <h3>Elige tu plan</h3>
            <p>Suscribete por 3 meses o compra libros individuales.</p>
          </div>
          <div className="home-how-arrow">→</div>
          <div className="home-how-step">
            <div className="home-how-number">3</div>
            <h3>Lee y disfruta</h3>
            <p>Accede a tu biblioteca personal desde cualquier dispositivo.</p>
          </div>
        </div>
      </section>

      {/* Libros destacados */}
      {destacados.length > 0 && (
        <section className="home-featured">
          <div className="home-featured-header">
            <h2>Libros destacados</h2>
            <Link to="/catalog" className="btn btn-outline">Ver todo →</Link>
          </div>
          <div className="books-grid">
            {destacados.map((libro) => (
              <TarjetaLibro key={libro._id} book={libro} />
            ))}
          </div>
        </section>
      )}

      {/* Características */}
      <section className="home-features">
        <div className="home-feature-row">
          <div className="home-feature-text">
            <span className="home-feature-tag">Biblioteca personal</span>
            <h2>Todos tus libros en un solo lugar</h2>
            <p>Guarda libros por suscripcion o por compra permanente. Tu biblioteca crece contigo.</p>
            <ul className="home-feature-list">
              <li>Guarda favoritos y lista de deseos</li>
              <li>Accede a libros adquiridos siempre</li>
              <li>Guarda tu progreso de lectura</li>
            </ul>
          </div>
          <div className="home-feature-visual">
            <div className="home-feature-card-stack">
              <div className="home-feature-card-item c1">Novela</div>
              <div className="home-feature-card-item c2">Ciencia Ficcion</div>
              <div className="home-feature-card-item c3">Fantasia</div>
            </div>
          </div>
        </div>

        <div className="home-feature-row reverse">
          <div className="home-feature-text">
            <span className="home-feature-tag">Lector digital</span>
            <h2>Lee a tu ritmo</h2>
            <p>Nuestro lector guarda tu progreso automaticamente. Cierra y continua exactamente donde lo dejaste.</p>
            <ul className="home-feature-list">
              <li>Barra de progreso en tiempo real</li>
              <li>Guardado automatico cada 2 segundos</li>
              <li>Continua donde lo dejaste</li>
            </ul>
          </div>
          <div className="home-feature-visual">
            <div className="home-feature-reader-demo">
              <div className="home-reader-bar">
                <div className="home-reader-fill" />
              </div>
              <div className="home-reader-text">
                <div className="home-reader-line w100" />
                <div className="home-reader-line w80" />
                <div className="home-reader-line w90" />
                <div className="home-reader-line w60" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
