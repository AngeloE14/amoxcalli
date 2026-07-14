import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { librosAPI, pagosAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import LIBROS_MOCK from '../data/mockBooks';

export default function Pago() {
  const { id } = useParams();
  const { agregarToast } = useToast();
  const navegar = useNavigate();
  const [libro, setLibro] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [metodo, setMetodo] = useState('Tarjeta de crédito');
  const [numeroTarjeta, setNumeroTarjeta] = useState('');
  const [nombreTarjeta, setNombreTarjeta] = useState('');
  const [vencimiento, setVencimiento] = useState('');
  const [cvv, setCvv] = useState('');

  useEffect(() => {
    librosAPI.getById(id)
      .then(({ data }) => setLibro(data))
      .catch(() => {
        const mock = LIBROS_MOCK.find((l) => l._id === id);
        if (mock) setLibro(mock);
        else agregarToast('No se pudo cargar la información del libro.', 'error');
      })
      .finally(() => setCargando(false));
  }, [id, agregarToast]);

  const manejarPago = async (e) => {
    e.preventDefault();
    setProcesando(true);
    // Intentar registrar el pago en el backend (si falla, se ignora y se continúa como demo)
    try {
      await pagosAPI.create({ libro: id, monto: libro.precio, metodoPago: metodo, idTransaccion: 'TXN-' + Date.now() });
    } catch {
      // pago demo, continuar
    }
    // Guardar el libro como "comprado" (permanent) en localStorage, solo si no ya está guardado
    const biblio = JSON.parse(localStorage.getItem('biblioteca') || '[]');
    if (!biblio.some((item) => item.libro?._id === id)) {
      biblio.push({
        _id: 'bib_' + Date.now(),
        libro,
        tipoCompra: 'permanent', // 'permanent' = comprado, 'subscription' = guardado
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem('biblioteca', JSON.stringify(biblio));
    }
    agregarToast('¡Compra realizada con éxito!');
    navegar('/library');
    setProcesando(false);
  };

  if (cargando) return (
    <div className="detail-loading"><div className="spinner" /><p>Cargando...</p></div>
  );

  if (!libro) return (
    <div className="empty-state"><p>Libro no encontrado.</p></div>
  );

  return (
    <div className="payment-page">
      <h1>Comprar Libro</h1>
      <div className="payment-layout">
        <div className="payment-book-info">
          <div className="payment-book-cover">
            {libro.portada ? <img src={libro.portada} alt={libro.titulo} /> : <div className="book-card-placeholder large">{libro.titulo[0]}</div>}
          </div>
          <div>
            <h2>{libro.titulo}</h2>
            <p className="book-detail-author">por {libro.autor}</p>
            <p className="payment-price">${libro.precio?.toFixed(2)} MXN</p>
          </div>
        </div>

        <form onSubmit={manejarPago} className="payment-form">
          <h2>Método de pago</h2>
          <div className="payment-methods">
            {['Tarjeta de crédito', 'Tarjeta de débito', 'PayPal'].map((opcion) => (
              <label key={opcion} className={`payment-method-option ${metodo === opcion ? 'active' : ''}`}>
                <input type="radio" name="method" value={opcion} checked={metodo === opcion} onChange={(e) => setMetodo(e.target.value)} />
                {opcion}
              </label>
            ))}
          </div>
          {metodo !== 'PayPal' && (
            <>
              <div className="input-group">
                <label>Número de tarjeta</label>
                <input type="text" placeholder="4242 4242 4242 4242" value={numeroTarjeta} onChange={(e) => setNumeroTarjeta(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>Nombre en la tarjeta</label>
                <input type="text" placeholder="Juan Pérez" value={nombreTarjeta} onChange={(e) => setNombreTarjeta(e.target.value)} required />
              </div>
              <div className="input-group-row">
                <div className="input-group">
                  <label>Vencimiento</label>
                  <input type="text" placeholder="MM/AA" value={vencimiento} onChange={(e) => setVencimiento(e.target.value)} required />
                </div>
                <div className="input-group">
                  <label>CVV</label>
                  <input type="text" placeholder="123" value={cvv} onChange={(e) => setCvv(e.target.value)} required />
                </div>
              </div>
            </>
          )}
          {metodo === 'PayPal' && (
            <div className="paypal-info">
              <p>Serás redirigido a PayPal para completar el pago.</p>
            </div>
          )}
          <div className="payment-summary">
            <span>Total a pagar:</span>
            <span className="payment-total">${libro.precio?.toFixed(2)} MXN</span>
          </div>
          <button type="submit" className="btn btn-primary btn-lg" disabled={procesando}>
            {procesando ? 'Procesando...' : `Pagar $${libro.precio?.toFixed(2)} MXN`}
          </button>
          <p className="payment-note">Pago simulado. No se realizará ningún cargo real.</p>
        </form>
      </div>
    </div>
  );
}
