import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { librosAPI } from '../services/api';
import LIBROS_MOCK from '../data/mockBooks';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function LectorPdf() {
  const { id } = useParams();
  const [libro, setLibro] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.2);
  const [cargando, setCargando] = useState(true);
  const [errorPdf, setErrorPdf] = useState(null);
  const scrollRef = useRef(null);
  const pageRefs = useRef({});

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

  // Atajos de teclado: +/- para zoom, flechas para desplazar
  useEffect(() => {
    function handleKeyDown(e) {
      const container = scrollRef.current;
      if (!container) return;
      if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        setScale((s) => Math.min(s + 0.2, 3));
      } else if (e.key === '-') {
        e.preventDefault();
        setScale((s) => Math.max(s - 0.2, 0.6));
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

  // Observer para detectar qué página está visible al hacer scroll
  useEffect(() => {
    if (!numPages) return;
    const container = scrollRef.current;
    if (!container) return;

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

    Object.values(pageRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [numPages, scale]);

  const onDocumentLoadSuccess = ({ numPages: total }) => {
    setNumPages(total);
    setPageNumber(1);
  };

  const onDocumentLoadError = (err) => {
    setErrorPdf('Error al cargar el PDF. Verifica que la URL sea válida y accesible.');
    console.error('PDF load error:', err);
  };

  const scrollToPage = useCallback((page) => {
    const el = pageRefs.current[page];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const registerPageRef = useCallback((page, el) => {
    if (el) pageRefs.current[page] = el;
  }, []);

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
          {libro.portada && <img src={libro.portada} alt={libro.titulo} className="pdf-reader-cover" />}
          <div>
            <h1>{libro.titulo}</h1>
            <p>{libro.autor}</p>
          </div>
        </div>
        <div className="pdf-reader-controls">
          <button onClick={() => setScale((s) => Math.max(s - 0.2, 0.6))} className="btn btn-outline btn-sm" title="Reducir (−)">−</button>
          <span className="pdf-zoom-level">{Math.round(scale * 100)}%</span>
          <button onClick={() => setScale((s) => Math.min(s + 0.2, 3))} className="btn btn-outline btn-sm" title="Ampliar (+)">+</button>
        </div>
      </div>

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

      <div className="pdf-reader-content" ref={scrollRef}>
        <Document
          file={`/api/books/${id}/pdf`}
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
