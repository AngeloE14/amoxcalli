import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { librosAPI, comprasAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useEffect } from 'react';
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
    try {
      await comprasAPI.create({ bookId: id, paymentMethod: metodo });
      agregarToast('¡Compra realizada con éxito!');
      navegar('/library');
    } catch {
      agregarToast('¡Compra registrada! (modo demo)', 'exito');
      navegar('/library');
    } finally {
      setProcesando(false);
    }
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
            {libro.coverUrl ? <img src={libro.coverUrl} alt={libro.title} /> : <div className="book-card-placeholder large">{libro.title[0]}</div>}
          </div>
          <div>
            <h2>{libro.title}</h2>
            <p className="book-detail-author">por {libro.author}</p>
            <p className="payment-price">${libro.price?.toFixed(2)} MXN</p>
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
            <span className="payment-total">${libro.price?.toFixed(2)} MXN</span>
          </div>
          <button type="submit" className="btn btn-primary btn-lg" disabled={procesando}>
            {procesando ? 'Procesando...' : `Pagar $${libro.price?.toFixed(2)} MXN`}
          </button>
          <p className="payment-note">Pago simulado. No se realizará ningún cargo real.</p>
        </form>
      </div>
    </div>
  );
}
