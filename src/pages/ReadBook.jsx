import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { librosAPI, suscripcionesAPI, progresoLecturaAPI, bibliotecaAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import LIBROS_MOCK from '../data/mockBooks';

export default function LeerLibro() {
  const { id } = useParams();
  const { usuario } = useAuth();
  const { agregarToast } = useToast();
  const [libro, setLibro] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [tieneAcceso, setTieneAcceso] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const contenidoRef = useRef(null);
  const temporizadorGuardadoRef = useRef(null);

  useEffect(() => {
    async function cargar() {
      try {
        const { data: datosLibro } = await librosAPI.getById(id);
        setLibro(datosLibro);
        if (usuario) {
          const { data: sub } = await suscripcionesAPI.getMine();
          const { data: itemsBiblio } = await bibliotecaAPI.getAll();
          const enBiblioteca = itemsBiblio.some((item) => item.book?._id === id);
          setTieneAcceso(!!sub || enBiblioteca);
          if (enBiblioteca || !!sub) {
            const { data: progresoGuardado } = await progresoLecturaAPI.get(id);
            if (progresoGuardado && progresoGuardado.paragraph > 0) {
              setProgreso(progresoGuardado.percentage || 0);
              setTimeout(() => {
                if (contenidoRef.current) {
                  const parrafos = contenidoRef.current.querySelectorAll('p');
                  if (parrafos[progresoGuardado.paragraph]) {
                    parrafos[progresoGuardado.paragraph].scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }
              }, 100);
            }
          }
        }
      } catch {
        const mock = LIBROS_MOCK.find((l) => l._id === id);
        if (mock) { setLibro(mock); setTieneAcceso(true); }
        else agregarToast('No se pudo cargar el contenido del libro. Verifica tu suscripción.', 'error');
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, [id, usuario, agregarToast]);

  const guardarProgreso = useCallback((porcentaje) => {
    if (temporizadorGuardadoRef.current) clearTimeout(temporizadorGuardadoRef.current);
    temporizadorGuardadoRef.current = setTimeout(() => {
      const indiceParrafo = Math.floor((porcentaje / 100) * (libro?.content?.split('\n\n')?.length || 1));
      progresoLecturaAPI.save(id, { paragraph: indiceParrafo, percentage: porcentaje }).catch(() => {});
    }, 2000);
  }, [id, libro]);

  useEffect(() => {
    const manejarScroll = () => {
      if (!contenidoRef.current || !libro) return;
      const elemento = contenidoRef.current;
      const posicionScroll = window.scrollY - elemento.offsetTop + window.innerHeight * 0.5;
      const alturaTotal = elemento.scrollHeight;
      const porcentaje = Math.min(100, Math.max(0, Math.round((posicionScroll / alturaTotal) * 100)));
      setProgreso(porcentaje);
      guardarProgreso(porcentaje);
    };
    window.addEventListener('scroll', manejarScroll);
    return () => window.removeEventListener('scroll', manejarScroll);
  }, [libro, guardarProgreso]);

  if (cargando) return (
    <div className="read-loading"><div className="spinner" /><p>Cargando libro...</p></div>
  );

  if (!libro) return (
    <div className="read-error">
      <h2>Libro no encontrado</h2>
      <Link to="/catalog" className="btn btn-primary">Volver al catálogo</Link>
    </div>
  );

  if (!tieneAcceso) return (
    <div className="read-error">
      <h2>Sin acceso</h2>
      <p>Necesitas una suscripción activa o haber comprado este libro para leerlo.</p>
      <Link to="/plans" className="btn btn-primary">Ver planes</Link>
    </div>
  );

  return (
    <div className="read-page">
      <div className="read-progress-bar">
        <div className="read-progress-fill" style={{ width: `${progreso}%` }} />
        <span className="read-progress-text">{progreso}%</span>
      </div>
      <div className="read-header">
        <Link to={`/books/${id}`} className="read-back">← Volver al libro</Link>
        <div className="read-meta">
          <h1>{libro.title}</h1>
          <p>por {libro.author}</p>
        </div>
      </div>
      <div className="read-content" ref={contenidoRef}>
        {libro.content.split('\n\n').map((parrafo, indice) => (
          <p key={indice}>{parrafo}</p>
        ))}
      </div>
    </div>
  );
}
