// ============================================================
// src/pages/AdminBooks.jsx — Panel de Administración de Libros
// ============================================================
// Panel exclusivo para administradores. Permite:
// 1. Crear libros nuevos con todos sus campos (incluido URL del PDF)
// 2. Editar libros existentes
// 3. Eliminar libros
// 4. Ver tabla con todos los libros del catálogo

import { useState, useEffect } from 'react';
import { librosAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import LIBROS_MOCK from '../data/mockBooks';

const GENEROS = ['Novela', 'Ciencia Ficción', 'Fantasía', 'Romance', 'Clásico'];

export default function AdminLibros() {
  const { agregarToast } = useToast();
  const [libros, setLibros] = useState([]);           // Lista de todos los libros
  const [cargando, setCargando] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false); // Toggle formulario
  const [editandoId, setEditandoId] = useState(null);  // ID del libro que se está editando (null = creando nuevo)
  // Formulario para crear/editar libros
  const [formulario, setFormulario] = useState({
    titulo: '', autor: '', descripcion: '', portada: '', genero: 'Novela',
    idioma: 'Español', precio: '179.99', paginas: '0', contenido: '', pdfUrl: '',
  });

  // Cargar libros al montar el componente
  useEffect(() => { cargarLibros(); }, []);

  // Consultar todos los libros de la API
  const cargarLibros = () => {
    setCargando(true);
    librosAPI.getAll()
      .then(({ data }) => setLibros(data))
      .catch(() => setLibros(LIBROS_MOCK)) // Fallback a datos mock
      .finally(() => setCargando(false));
  };

  // Limpiar el formulario y cerrar el modo edición
  const limpiarFormulario = () => {
    setFormulario({
      titulo: '', autor: '', descripcion: '', portada: '', genero: 'Novela',
      idioma: 'Español', precio: '179.99', paginas: '0', contenido: '', pdfUrl: '',
    });
    setEditandoId(null);
    setMostrarFormulario(false);
  };

  // ============================================================
  // Enviar formulario: crear libro nuevo o actualizar existente
  // ============================================================
  const manejarEnvio = async (e) => {
    e.preventDefault();
    // Convertir precio y páginas de string a número
    const carga = { ...formulario, precio: parseFloat(formulario.precio), paginas: parseInt(formulario.paginas) || 0 };
    try {
      if (editandoId) {
        await librosAPI.update(editandoId, carga);
        agregarToast('Libro actualizado');
      } else {
        await librosAPI.create(carga);
        agregarToast('Libro creado');
      }
      limpiarFormulario();
      cargarLibros(); // Recargar la tabla
    } catch {
      // Modo demo: simular creación/edición localmente si la API falla
      const nuevoLibro = { _id: 'mock_' + Date.now(), ...carga };
      setLibros((anterior) => editandoId
        ? anterior.map((l) => l._id === editandoId ? { ...l, ...carga } : l)
        : [...anterior, nuevoLibro]
      );
      agregarToast(editandoId ? 'Libro actualizado (demo)' : 'Libro creado (demo)');
      limpiarFormulario();
    }
  };

  // Cargar datos de un libro en el formulario para editarlo
  const manejarEditar = (libro) => {
    setFormulario({
      titulo: libro.titulo, autor: libro.autor, descripcion: libro.descripcion,
      portada: libro.portada || '', genero: libro.genero, idioma: libro.idioma || 'Español',
      precio: String(libro.precio || 179.99), paginas: String(libro.paginas || 0), contenido: libro.contenido || '',
      pdfUrl: libro.pdfUrl || '',
    });
    setEditandoId(libro._id);
    setMostrarFormulario(true);
  };

  // Eliminar un libro con confirmación
  const manejarEliminar = async (id) => {
    if (!confirm('¿Eliminar este libro?')) return;
    try {
      await librosAPI.delete(id);
      agregarToast('Libro eliminado');
      cargarLibros();
    } catch {
      // Modo demo: eliminar localmente
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

      {/* ========== FORMULARIO DE CREAR/EDITAR ========== */}
      {mostrarFormulario && (
        <form onSubmit={manejarEnvio} className="admin-form">
          <h2>{editandoId ? 'Editar Libro' : 'Nuevo Libro'}</h2>
          <div className="admin-form-grid">
            <div className="input-group">
              <label>Título</label>
              <input type="text" value={formulario.titulo} onChange={(e) => setFormulario({ ...formulario, titulo: e.target.value })} required />
            </div>
            <div className="input-group">
              <label>Autor</label>
              <input type="text" value={formulario.autor} onChange={(e) => setFormulario({ ...formulario, autor: e.target.value })} required />
            </div>
            <div className="input-group">
              <label>Género</label>
              <select value={formulario.genero} onChange={(e) => setFormulario({ ...formulario, genero: e.target.value })}>
                {GENEROS.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label>Idioma</label>
              <input type="text" value={formulario.idioma} onChange={(e) => setFormulario({ ...formulario, idioma: e.target.value })} />
            </div>
            <div className="input-group">
              <label>Precio (MXN)</label>
              <input type="number" step="0.01" value={formulario.precio} onChange={(e) => setFormulario({ ...formulario, precio: e.target.value })} />
            </div>
            <div className="input-group">
              <label>Páginas</label>
              <input type="number" value={formulario.paginas} onChange={(e) => setFormulario({ ...formulario, paginas: e.target.value })} />
            </div>
            <div className="input-group full-width">
              <label>URL de portada</label>
              <input type="text" value={formulario.portada} onChange={(e) => setFormulario({ ...formulario, portada: e.target.value })} />
            </div>
            {/* Campo para URL del PDF: se usa en el lector de PDF */}
            <div className="input-group full-width">
              <label>URL del PDF</label>
              <input type="text" value={formulario.pdfUrl} onChange={(e) => setFormulario({ ...formulario, pdfUrl: e.target.value })} placeholder="https://ejemplo.com/libro.pdf" />
            </div>
            <div className="input-group full-width">
              <label>Descripción</label>
              <textarea value={formulario.descripcion} onChange={(e) => setFormulario({ ...formulario, descripcion: e.target.value })} required rows={3} />
            </div>
            <div className="input-group full-width">
              <label>Contenido del libro</label>
              <textarea value={formulario.contenido} onChange={(e) => setFormulario({ ...formulario, contenido: e.target.value })} rows={6} />
            </div>
          </div>
          <div className="admin-form-actions">
            <button type="submit" className="btn btn-primary">{editandoId ? 'Actualizar' : 'Crear'}</button>
            <button type="button" className="btn btn-outline" onClick={limpiarFormulario}>Cancelar</button>
          </div>
        </form>
      )}

      {/* ========== TABLA DE LIBROS ========== */}
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
                  <td>{libro.titulo}</td>
                  <td>{libro.autor}</td>
                  <td>{libro.genero}</td>
                  <td>{libro.idioma}</td>
                  <td>${libro.precio?.toFixed(2)} MXN</td>
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
