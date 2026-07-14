import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf'; // Librería para renderizar PDFs usando PDF.js
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { librosAPI } from '../services/api';
import LIBROS_MOCK from '../data/mockBooks';

// Worker de PDF.js necesario para procesar los PDFs en segundo plano
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function LectorPdf() {
  const { id } = useParams();
  const [libro, setLibro] = useState(null);
  const [numPages, setNumPages] = useState(null); // Total de páginas del PDF
  const [pageNumber, setPageNumber] = useState(1); // Página actual visible
  const [scale, setScale] = useState(1.2); // Nivel de zoom (1.0 = 100%)
  const [cargando, setCargando] = useState(true);
  const [errorPdf, setErrorPdf] = useState(null);

  // Cargar datos del libro desde la API al montar el componente
  useEffect(() => {
    async function cargar() {
      try {
        const { data } = await librosAPI.getById(id);
        setLibro(data);
      } catch {
        // Si la API falla, intentar con datos mock
        const mock = LIBROS_MOCK.find((l) => l._id === id);
        if (mock) setLibro(mock);
        else setErrorPdf('Libro no encontrado');
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, [id]);

  // Se ejecuta cuando PDF.js termina de cargar el documento correctamente
  const onDocumentLoadSuccess = ({ numPages: total }) => {
    setNumPages(total);
    setPageNumber(1); // Reiniciar a página 1 cuando se carga un nuevo PDF
  };

  const onDocumentLoadError = (err) => {
    setErrorPdf('Error al cargar el PDF. Verifica que la URL sea válida y accesible.');
    console.error('PDF load error:', err);
  };

  if (cargando) {
    return (
      <div className="read-loading">
        <div className="spinner" />
        <p>Cargando libro...</p>
      </div>
    );
  }

  if (errorPdf || !libro) {
    return (
      <div className="read-error">
        <h2>No se pudo cargar el libro</h2>
        <p>{errorPdf || 'Libro no encontrado'}</p>
        <Link to="/catalog" className="btn btn-primary">Volver al catálogo</Link>
      </div>
    );
  }

  if (!libro.pdfUrl) {
    return (
      <div className="read-error">
        <h2>Este libro no tiene PDF disponible</h2>
        <p>El administrador aún no ha agregado un archivo PDF para este libro.</p>
        <Link to={`/books/${id}`} className="btn btn-primary">Volver al detalle</Link>
      </div>
    );
  }

  return (
    <div className="pdf-reader">
      <div className="pdf-reader-header">
        <Link to={`/books/${id}`} className="read-back">← Volver al detalle</Link>
        <div className="pdf-reader-info">
          <h1>{libro.titulo}</h1>
          <p>{libro.autor}</p>
        </div>
        <div className="pdf-reader-controls">
          <button onClick={() => setScale((s) => Math.max(s - 0.2, 0.6))} className="btn btn-outline btn-sm" title="Reducir">−</button>
          <span className="pdf-zoom-level">{Math.round(scale * 100)}%</span>
          <button onClick={() => setScale((s) => Math.min(s + 0.2, 3))} className="btn btn-outline btn-sm" title="Ampliar">+</button>
        </div>
      </div>

      <div className="pdf-reader-nav">
        <button onClick={() => setPageNumber((p) => Math.max(p - 1, 1))} disabled={pageNumber <= 1} className="btn btn-outline btn-sm">
          ← Anterior
        </button>
        <span className="pdf-page-info">
          Página {pageNumber} de {numPages || '...'}
        </span>
        <button onClick={() => setPageNumber((p) => Math.min(p + 1, numPages))} disabled={pageNumber >= numPages} className="btn btn-outline btn-sm">
          Siguiente →
        </button>
      </div>

      <div className="pdf-reader-content">
        <Document
          file={libro.pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={<div className="read-loading"><div className="spinner" /><p>Cargando PDF...</p></div>}
          error={<div className="read-error"><p>No se pudo cargar el PDF. Verifica la URL.</p></div>}
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            renderTextLayer={true}
            renderAnnotationLayer={true}
          />
        </Document>
      </div>
    </div>
  );
}
