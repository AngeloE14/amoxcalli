import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { PLANS } from '../data/mockBooks';

export default function Planes() {
  const { usuario, seleccionarPlan } = useAuth();
  const { agregarToast } = useToast();
  const [seleccionado, setSeleccionado] = useState(null);
  const navegar = useNavigate();

  const manejarSeleccion = (planId) => {
    if (!usuario) return navegar('/login');
    setSeleccionado(planId);
    seleccionarPlan(planId);
    agregarToast('¡Suscripción activada! (modo demo)');
    navegar('/catalog');
  };

  return (
    <div className="plans-page">
      <h1>Elige tu plan</h1>
      <p className="plans-subtitle">Todos los planes incluyen acceso inmediato al catálogo completo.</p>
      <div className="plans-grid">
        {PLANS.map((plan, indice) => (
          <div key={plan._id} className={`plan-card ${indice === PLANS.length - 1 ? 'featured' : ''} ${seleccionado === plan._id ? 'selected' : ''}`}>
            {indice === PLANS.length - 1 && <div className="plan-badge">Popular</div>}
            <h3>{plan.name}</h3>
            <div className="plan-price">
              <span className="currency">$</span>
              <span className="amount">{plan.price}</span>
              <span className="period">MXN / 3 meses</span>
            </div>
            <p className="plan-description">{plan.description}</p>
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
