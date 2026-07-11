import { useState, useEffect } from 'react';
import { librosAPI } from '../services/api';
import TarjetaLibro from '../components/BookCard';
import LIBROS_MOCK from '../data/mockBooks';

const GENEROS = ['Todos', 'Novela', 'Ciencia Ficción', 'Fantasía', 'Romance', 'Clásico'];
const OPCIONES_ORDEN = [
  { valor: '', etiqueta: 'Sin orden' },
  { valor: 'title', etiqueta: 'Título A-Z' },
  { valor: 'author', etiqueta: 'Autor A-Z' },
  { valor: 'price_asc', etiqueta: 'Menor precio' },
  { valor: 'price_desc', etiqueta: 'Mayor precio' },
  { valor: 'newest', etiqueta: 'Más recientes' },
];
const IDIOMAS = ['', 'Español', 'Inglés'];

function EsqueletoCarga() {
  return (
    <div className="books-grid">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="book-card-skeleton">
          <div className="skeleton-cover" />
          <div className="skeleton-info">
            <div className="skeleton-line w-80" />
            <div className="skeleton-line w-60" />
            <div className="skeleton-line w-40" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Catalogo() {
  const [libros, setLibros] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [busquedaAutor, setBusquedaAutor] = useState('');
  const [generoActivo, setGeneroActivo] = useState('Todos');
  const [idioma, setIdioma] = useState('');
  const [orden, setOrden] = useState('');

  useEffect(() => {
    setCargando(true);
    const parametros = {};
    if (busqueda) parametros.search = busqueda;
    if (busquedaAutor) parametros.author = busquedaAutor;
    if (generoActivo && generoActivo !== 'Todos') parametros.genre = generoActivo;
    if (idioma) parametros.language = idioma;
    if (orden) parametros.sort = orden;

    librosAPI.getAll(parametros)
      .then(({ data }) => setLibros(data))
      .catch(() => {
        let filtrados = [...LIBROS_MOCK];
        if (busqueda) filtrados = filtrados.filter((l) => l.title.toLowerCase().includes(busqueda.toLowerCase()));
        if (busquedaAutor) filtrados = filtrados.filter((l) => l.author.toLowerCase().includes(busquedaAutor.toLowerCase()));
        if (generoActivo && generoActivo !== 'Todos') filtrados = filtrados.filter((l) => l.genre === generoActivo);
        if (idioma) filtrados = filtrados.filter((l) => l.language === idioma);
        if (orden === 'title') filtrados.sort((a, b) => a.title.localeCompare(b.title));
        else if (orden === 'author') filtrados.sort((a, b) => a.author.localeCompare(b.author));
        else if (orden === 'price_asc') filtrados.sort((a, b) => a.price - b.price);
        else if (orden === 'price_desc') filtrados.sort((a, b) => b.price - a.price);
        setLibros(filtrados);
      })
      .finally(() => setCargando(false));
  }, [busqueda, busquedaAutor, generoActivo, idioma, orden]);

  return (
    <div className="catalog-page">
      <h1>Catálogo de Libros</h1>
      <div className="catalog-filters">
        <div className="search-row">
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input type="text" placeholder="Buscar por título..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="search-input" />
            {busqueda && <button className="search-clear" onClick={() => setBusqueda('')}>✕</button>}
          </div>
          <div className="search-wrapper">
            <span className="search-icon">✍️</span>
            <input type="text" placeholder="Buscar por autor..." value={busquedaAutor} onChange={(e) => setBusquedaAutor(e.target.value)} className="search-input" />
            {busquedaAutor && <button className="search-clear" onClick={() => setBusquedaAutor('')}>✕</button>}
          </div>
        </div>
        <div className="filter-row">
          <select value={idioma} onChange={(e) => setIdioma(e.target.value)} className="filter-select">
            <option value="">Todos los idiomas</option>
            {IDIOMAS.filter(Boolean).map((idioma) => (
              <option key={idioma} value={idioma}>{idioma}</option>
            ))}
          </select>
          <select value={orden} onChange={(e) => setOrden(e.target.value)} className="filter-select">
            {OPCIONES_ORDEN.map((opcion) => (
              <option key={opcion.valor} value={opcion.valor}>{opcion.etiqueta}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="genre-tabs">
        {GENEROS.map((genero) => (
          <button key={genero} className={`genre-tab ${generoActivo === genero ? 'active' : ''}`} onClick={() => setGeneroActivo(genero)}>
            {genero}
          </button>
        ))}
      </div>
      {cargando ? (
        <EsqueletoCarga />
      ) : libros.length === 0 ? (
        <div className="empty-state">
          <p>No se encontraron libros con esos filtros.</p>
          <button className="btn btn-primary" onClick={() => { setBusqueda(''); setBusquedaAutor(''); setGeneroActivo('Todos'); setIdioma(''); setOrden(''); }}>
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="books-grid">
          {libros.map((libro) => (
            <TarjetaLibro key={libro._id} book={libro} />
          ))}
        </div>
      )}
    </div>
  );
}
