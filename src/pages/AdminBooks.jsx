import { useState, useEffect } from 'react';
import { librosAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import LIBROS_MOCK from '../data/mockBooks';

const GENEROS = ['Novela', 'Ciencia Ficción', 'Fantasía', 'Romance', 'Clásico'];

export default function AdminLibros() {
  const { agregarToast } = useToast();
  const [libros, setLibros] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [formulario, setFormulario] = useState({
    title: '', author: '', description: '', coverUrl: '', genre: 'Novela',
    language: 'Español', price: '179.99', pages: '0', content: '',
  });

  useEffect(() => { cargarLibros(); }, []);

  const cargarLibros = () => {
    setCargando(true);
    librosAPI.getAll()
      .then(({ data }) => setLibros(data))
      .catch(() => setLibros(LIBROS_MOCK))
      .finally(() => setCargando(false));
  };

  const limpiarFormulario = () => {
    setFormulario({
      title: '', author: '', description: '', coverUrl: '', genre: 'Novela',
      language: 'Español', price: '179.99', pages: '0', content: '',
    });
    setEditandoId(null);
    setMostrarFormulario(false);
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    const carga = { ...formulario, price: parseFloat(formulario.price), pages: parseInt(formulario.pages) || 0 };
    try {
      if (editandoId) {
        await librosAPI.update(editandoId, carga);
        agregarToast('Libro actualizado');
      } else {
        await librosAPI.create(carga);
        agregarToast('Libro creado');
      }
      limpiarFormulario();
      cargarLibros();
    } catch {
      const nuevoLibro = { _id: 'mock_' + Date.now(), ...carga };
      setLibros((anterior) => editandoId
        ? anterior.map((l) => l._id === editandoId ? { ...l, ...carga } : l)
        : [...anterior, nuevoLibro]
      );
      agregarToast(editandoId ? 'Libro actualizado (demo)' : 'Libro creado (demo)');
      limpiarFormulario();
    }
  };

  const manejarEditar = (libro) => {
    setFormulario({
      title: libro.title, author: libro.author, description: libro.description,
      coverUrl: libro.coverUrl || '', genre: libro.genre, language: libro.language || 'Español',
      price: String(libro.price || 179.99), pages: String(libro.pages || 0), content: libro.content || '',
    });
    setEditandoId(libro._id);
    setMostrarFormulario(true);
  };

  const manejarEliminar = async (id) => {
    if (!confirm('¿Eliminar este libro?')) return;
    try {
      await librosAPI.delete(id);
      agregarToast('Libro eliminado');
      cargarLibros();
    } catch {
      setLibros((anterior) => anterior.filter((l) => l._id !== id));
      agregarToast('Libro eliminado (demo)');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Administrar Libros</h1>
        <button className="btn btn-primary" onClick={() => { limpiarFormulario(); setMostrarFormulario(!mostrarFormulario); }}>
          {mostrarFormulario ? 'Cancelar' : '+ Nuevo Libro'}
        </button>
      </div>

      {mostrarFormulario && (
        <form onSubmit={manejarEnvio} className="admin-form">
          <h2>{editandoId ? 'Editar Libro' : 'Nuevo Libro'}</h2>
          <div className="admin-form-grid">
            <div className="input-group">
              <label>Título</label>
              <input type="text" value={formulario.title} onChange={(e) => setFormulario({ ...formulario, title: e.target.value })} required />
            </div>
            <div className="input-group">
              <label>Autor</label>
              <input type="text" value={formulario.author} onChange={(e) => setFormulario({ ...formulario, author: e.target.value })} required />
            </div>
            <div className="input-group">
              <label>Género</label>
              <select value={formulario.genre} onChange={(e) => setFormulario({ ...formulario, genre: e.target.value })}>
                {GENEROS.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label>Idioma</label>
              <input type="text" value={formulario.language} onChange={(e) => setFormulario({ ...formulario, language: e.target.value })} />
            </div>
            <div className="input-group">
              <label>Precio (MXN)</label>
              <input type="number" step="0.01" value={formulario.price} onChange={(e) => setFormulario({ ...formulario, price: e.target.value })} />
            </div>
            <div className="input-group">
              <label>Páginas</label>
              <input type="number" value={formulario.pages} onChange={(e) => setFormulario({ ...formulario, pages: e.target.value })} />
            </div>
            <div className="input-group full-width">
              <label>URL de portada</label>
              <input type="text" value={formulario.coverUrl} onChange={(e) => setFormulario({ ...formulario, coverUrl: e.target.value })} />
            </div>
            <div className="input-group full-width">
              <label>Descripción</label>
              <textarea value={formulario.description} onChange={(e) => setFormulario({ ...formulario, description: e.target.value })} required rows={3} />
            </div>
            <div className="input-group full-width">
              <label>Contenido del libro</label>
              <textarea value={formulario.content} onChange={(e) => setFormulario({ ...formulario, content: e.target.value })} rows={6} />
            </div>
          </div>
          <div className="admin-form-actions">
            <button type="submit" className="btn btn-primary">{editandoId ? 'Actualizar' : 'Crear'}</button>
            <button type="button" className="btn btn-outline" onClick={limpiarFormulario}>Cancelar</button>
          </div>
        </form>
      )}

      {cargando ? (
        <div className="detail-loading"><div className="spinner" /><p>Cargando libros...</p></div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr><th>Título</th><th>Autor</th><th>Género</th><th>Idioma</th><th>Precio</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {libros.map((libro) => (
                <tr key={libro._id}>
                  <td>{libro.title}</td>
                  <td>{libro.author}</td>
                  <td>{libro.genre}</td>
                  <td>{libro.language}</td>
                  <td>${libro.price?.toFixed(2)} MXN</td>
                  <td className="admin-actions">
                    <button className="btn btn-sm btn-outline" onClick={() => manejarEditar(libro)}>Editar</button>
                    <button className="btn btn-sm btn-danger" onClick={() => manejarEliminar(libro._id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
