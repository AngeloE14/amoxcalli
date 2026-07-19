// ============================================================
// src/pages/PdfReader.jsx — Lector de PDF
// ============================================================
// Lector completo de PDF integrado en el navegador.
// Carga el PDF a través del proxy del backend (para evitar CORS).
// Incluye: zoom (+/-), navegación por páginas, atajos de teclado,
// y detección de página visible con IntersectionObserver.

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { librosAPI } from '../services/api';
import LIBROS_MOCK from '../data/mockBooks';

// ============================================================
// Configurar el worker de pdf.js: procesa los PDFs en un hilo
// separado (Web Worker) para no bloquear la interfaz
// ============================================================
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function LectorPdf() {
  const { id } = useParams();           // ID del libro desde la URL
  const [libro, setLibro] = useState(null);
  const [numPages, setNumPages] = useState(null);  // Total de páginas del PDF
  const [pageNumber, setPageNumber] = useState(1); // Página actual visible
  const [scale, setScale] = useState(1.2);          // Nivel de zoom (1.0 = 100%)
  const [cargando, setCargando] = useState(true);
  const [errorPdf, setErrorPdf] = useState(null);
  const scrollRef = useRef(null);         // Ref al contenedor de scroll
  const pageRefs = useRef({});            // Refs a cada contenedor de página para IntersectionObserver

  // Cargar info del libro desde la API, fallback a mock
  useEffect(() => {
    async function cargar() {
      try {
        const { data } = await librosAPI.getById(id);
        setLibro(data);
      } catch {
        const mock = LIBROS_MOCK.find((l) => l._id === id);
        if (mock) setLibro(mock);
        else setErrorPdf('Libro no encontrado');
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, [id]);

  // ============================================================
  // Atajos de teclado para el lector:
  // +/- = cambiar zoom, ArrowUp/Down = desplazar página
  // ============================================================
  useEffect(() => {
    function handleKeyDown(e) {
      const container = scrollRef.current;
      if (!container) return;
      if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        setScale((s) => Math.min(s + 0.2, 3)); // Zoom máximo 300%
      } else if (e.key === '-') {
        e.preventDefault();
        setScale((s) => Math.max(s - 0.2, 0.6)); // Zoom mínimo 60%
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        container.scrollBy({ top: 400, behavior: 'smooth' });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        container.scrollBy({ top: -400, behavior: 'smooth' });
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ============================================================
  // IntersectionObserver: detecta qué página está visible
  // para actualizar el contador de página actual
  // ============================================================
  useEffect(() => {
    if (!numPages) return;
    const container = scrollRef.current;
    if (!container) return;

    // Se dispara cuando una página entra/sale del 60% central del contenedor
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const page = Number(entry.target.dataset.page);
            if (page) setPageNumber(page);
        }
        }
      },
      { root: container, rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    );

    // Observar todas las páginas renderizadas
    Object.values(pageRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [numPages, scale]); // Re-crear observer cuando cambia el zoom o el número de páginas

  // Callback: se ejecuta cuando el PDF se carga exitosamente
  const onDocumentLoadSuccess = ({ numPages: total }) => {
    setNumPages(total);
    setPageNumber(1);
  };

  // Callback: se ejecuta si hay error al cargar el PDF
  const onDocumentLoadError = (err) => {
    setErrorPdf('Error al cargar el PDF. Verifica que la URL sea válida y accesible.');
    console.error('PDF load error:', err);
  };

  // Desplazarse suavemente a una página específica
  const scrollToPage = useCallback((page) => {
    const el = pageRefs.current[page];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  // Registrar un ref para cada contenedor de página
  const registerPageRef = useCallback((page, el) => {
    if (el) pageRefs.current[page] = el;
  }, []);

  // Estado de carga
  if (cargando) {
    return (
      <div className="read-loading">
        <div className="spinner" />
        <p>Cargando libro...</p>
      </div>
    );
  }

  // Error al cargar
  if (errorPdf || !libro) {
    return (
      <div className="read-error">
        <h2>No se pudo cargar el libro</h2>
        <p>{errorPdf || 'Libro no encontrado'}</p>
        <Link to="/catalog" className="btn btn-primary">Volver al catálogo</Link>
      </div>
    );
  }

  // Sin PDF disponible
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
      {/* Barra superior: enlace, info del libro y controles de zoom */}
      <div className="pdf-reader-header">
        <Link to={`/books/${id}`} className="read-back">← Volver al detalle</Link>
        <div className="pdf-reader-info">
          {libro.portada && <img src={libro.portada} alt={libro.titulo} className="pdf-reader-cover" />}
          <div>
            <h1>{libro.titulo}</h1>
            <p>{libro.autor}</p>
          </div>
        </div>
        {/* Controles de zoom: - / nivel actual / + */}
        <div className="pdf-reader-controls">
          <button onClick={() => setScale((s) => Math.max(s - 0.2, 0.6))} className="btn btn-outline btn-sm" title="Reducir (−)">−</button>
          <span className="pdf-zoom-level">{Math.round(scale * 100)}%</span>
          <button onClick={() => setScale((s) => Math.min(s + 0.2, 3))} className="btn btn-outline btn-sm" title="Ampliar (+)">+</button>
        </div>
      </div>

      {/* Navegación por páginas: Anterior / Página actual / Siguiente */}
      <div className="pdf-reader-nav">
        <button onClick={() => scrollToPage(Math.max(pageNumber - 1, 1))} disabled={pageNumber <= 1} className="btn btn-outline btn-sm">
          ← Anterior
        </button>
        <span className="pdf-page-info">
          Página {pageNumber} de {numPages || '...'}
        </span>
        <button onClick={() => scrollToPage(Math.min(pageNumber + 1, numPages))} disabled={pageNumber >= numPages} className="btn btn-outline btn-sm">
          Siguiente →
        </button>
      </div>

      {/* Contenido del PDF: todas las páginas renderizadas en scroll vertical */}
      <div className="pdf-reader-content" ref={scrollRef}>
        <Document
          file={`/api/books/${id}/pdf`} {/* URL del proxy del backend */}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={<div className="read-loading"><div className="spinner" /><p>Cargando PDF...</p></div>}
          error={<div className="read-error"><p>No se pudo cargar el PDF. Verifica la URL.</p></div>}
        >
          {numPages &&
            Array.from({ length: numPages }, (_, i) => (
              <div
                key={i}
                className="pdf-page-wrapper"
                data-page={i + 1}
                ref={(el) => registerPageRef(i + 1, el)}
              >
                <Page
                  pageNumber={i + 1}
                  scale={scale}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </div>
            ))}
        </Document>
      </div>
    </div>
  );
}
