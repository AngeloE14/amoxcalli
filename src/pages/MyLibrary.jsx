// ============================================================
// src/pages/MyLibrary.jsx — Página de Mi Biblioteca
// ============================================================
// Muestra los libros que el usuario ha guardado o comprado.
// Permite filtrar por: Todos, Guardados (subscription), Comprados (permanent).
// Los datos se leen de localStorage (no de la API).

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TarjetaLibro from '../components/BookCard';

// Leer la biblioteca guardada en localStorage del navegador
function obtenerBiblioteca() {
  return JSON.parse(localStorage.getItem('biblioteca') || '[]');
}

export default function MiBiblioteca() {
  const [elementos, setElementos] = useState([]);  // Todos los elementos de la biblioteca
  const [filtro, setFiltro] = useState('todos');    // Filtro activo: 'todos', 'subscription', 'permanent'

  // Cargar biblioteca del localStorage al montar el componente
  useEffect(() => {
    setElementos(obtenerBiblioteca());
  }, []);

  // Aplicar filtro según la selección del usuario
  const filtrados = elementos.filter((item) => {
    if (filtro === 'todos') return true;
    return item.tipoCompra === filtro;
  });

  return (
    <div className="library-page">
      <h1>Mi Biblioteca</h1>

      {/* Estado vacío: si no hay libros guardados */}
      {elementos.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <p>No has guardado ningún libro aún.</p>
          <Link to="/catalog" className="btn btn-primary">Explorar Catálogo</Link>
        </div>
      ) : (
        <>
          {/* Filtros de tipo de compra */}
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
          {/* Grid de libros de la biblioteca */}
          <div className="books-grid">
            {filtrados.map((item) => (
              <div key={item._id} className="library-item-wrapper">
                <TarjetaLibro book={item.libro} />
                {/* Badge que indica si es "Comprado" o "Guardado" */}
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
