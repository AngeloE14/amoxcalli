import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TarjetaLibro from '../components/BookCard';

function obtenerBiblioteca() {
  return JSON.parse(localStorage.getItem('biblioteca') || '[]');
}

export default function MiBiblioteca() {
  const [elementos, setElementos] = useState([]);
  const [filtro, setFiltro] = useState('todos');

  useEffect(() => {
    setElementos(obtenerBiblioteca());
  }, []);

  const filtrados = elementos.filter((item) => {
    if (filtro === 'todos') return true;
    return item.tipoCompra === filtro;
  });

  return (
    <div className="library-page">
      <h1>Mi Biblioteca</h1>

      {elementos.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <p>No has guardado ningún libro aún.</p>
          <Link to="/catalog" className="btn btn-primary">Explorar Catálogo</Link>
        </div>
      ) : (
        <>
          <div className="library-filters">
            <button className={`genre-tab ${filtro === 'todos' ? 'active' : ''}`} onClick={() => setFiltro('todos')}>
              Todos ({elementos.length})
            </button>
            <button className={`genre-tab ${filtro === 'subscription' ? 'active' : ''}`} onClick={() => setFiltro('subscription')}>
              Guardados ({elementos.filter((e) => e.tipoCompra === 'subscription').length})
            </button>
            <button className={`genre-tab ${filtro === 'permanent' ? 'active' : ''}`} onClick={() => setFiltro('permanent')}>
              Comprados ({elementos.filter((e) => e.tipoCompra === 'permanent').length})
            </button>
          </div>
          <div className="books-grid">
            {filtrados.map((item) => (
              <div key={item._id} className="library-item-wrapper">
                <TarjetaLibro book={item.libro} />
                <span className={`library-item-badge ${item.tipoCompra}`}>
                  {item.tipoCompra === 'permanent' ? 'Comprado' : 'Guardado'}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
