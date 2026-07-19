// ============================================================
// src/components/PlanCard.jsx — Tarjeta de Plan de Suscripción (Componente reutilizable)
// ============================================================
// Muestra un plan de suscripción: nombre, precio, descripción,
// lista de características y botón de suscripción.
// Se usa en la página de selección de planes (/plans).

export default function PlanCard({ plan, onSelect, selected, featured }) {
  // Convertir días del plan a meses para mostrar en la UI
  const meses = Math.round(plan.duracionDias / 30);
  return (
    <div className={`plan-card ${featured ? 'plan-featured' : ''} ${selected ? 'plan-card-selected' : ''}`}>
      {/* Badge "Popular" solo se muestra si el plan está destacado */}
      {featured && <span className="plan-badge">Popular</span>}
      <h3>{plan.nombre}</h3>
      <p className="plan-price">${plan.precio.toFixed(2)}<span>/mes</span></p>
      <p className="plan-desc">{plan.descripcion}</p>
      <ul className="plan-features">
        {/* Si maxLibros tiene valor, mostrar el límite; si no, "ilimitado" */}
        <li>{plan.maxLibros ? `Hasta ${plan.maxLibros} libros` : 'Libros ilimitados'}</li>
        <li>{meses} meses de acceso</li>
        <li>Reseña y guarda libros</li>
        <li>Compra libros individuales</li>
      </ul>
      <button
        onClick={() => onSelect(plan._id)}
        className={`btn ${featured ? 'btn-primary' : 'btn-outline'} btn-lg`}
        disabled={selected} // Deshabilitar si ya está seleccionado
      >
        {selected ? 'Suscribiendo...' : 'Suscribirse'}
      </button>
    </div>
  );
}
