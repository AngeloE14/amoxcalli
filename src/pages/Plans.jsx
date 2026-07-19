// ============================================================
// src/pages/Plans.jsx — Página de Selección de Planes
// ============================================================
// Muestra los dos planes de suscripción disponibles (Estándar y Premium).
// El usuario elige uno y se guarda tanto en MongoDB como en localStorage.
// Requiere autenticación para suscribirse.

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { PLANS } from '../data/mockBooks'; // Datos mock de los planes

export default function Planes() {
  const { usuario, seleccionarPlan } = useAuth();
  const { agregarToast } = useToast();
  const [seleccionado, setSeleccionado] = useState(null); // Plan en proceso de activación
  const navegar = useNavigate();

  // ============================================================
  // Manejar selección de plan
  // Si no está logueado, redirigir a login
  // Si está logueado, guardar el plan en backend + localStorage
  // ============================================================
  const manejarSeleccion = async (planId) => {
    if (!usuario) return navegar('/login'); // Requiere sesión
    setSeleccionado(planId);
    try {
      await seleccionarPlan(planId); // Guarda en MongoDB + localStorage
      agregarToast('¡Suscripción activada!');
      navegar('/catalog'); // Redirigir al catálogo después de suscribirse
    } catch {
      agregarToast('No se pudo guardar el plan. Intenta de nuevo.', 'error');
    }
    setSeleccionado(null);
  };

  return (
    <div className="plans-page">
      <h1>Elige tu plan</h1>
      <p className="plans-subtitle">Todos los planes incluyen acceso inmediato al catálogo completo.</p>
      <div className="plans-grid">
        {PLANS.map((plan, indice) => (
          <div key={plan._id} className={`plan-card ${indice === PLANS.length - 1 ? 'featured' : ''} ${seleccionado === plan._id ? 'selected' : ''}`}>
            {/* Badge "Popular" en el último plan (Premium) */}
            {indice === PLANS.length - 1 && <div className="plan-badge">Popular</div>}
            <h3>{plan.nombre}</h3>
            <div className="plan-price">
              <span className="currency">$</span>
              <span className="amount">{plan.precio}</span>
              <span className="period">MXN / 3 meses</span>
            </div>
            <p className="plan-description">{plan.descripcion}</p>
            {/* Lista de características del plan */}
            <ul className="plan-features">
              {plan.features.map((caracteristica, i) => (
                <li key={i} className={plan.restricted && i > 1 ? 'restricted' : ''}>
                  {plan.restricted && i > 1 ? '✕' : '✓'} {caracteristica}
                </li>
              ))}
            </ul>
            <button
              className={`btn btn-primary plan-btn ${seleccionado === plan._id ? 'loading' : ''}`}
              onClick={() => manejarSeleccion(plan._id)}
              disabled={seleccionado === plan._id}
            >
              {seleccionado === plan._id ? 'Activando...' : 'Suscribirme'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
