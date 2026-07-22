export default function PlanCard({ plan, onSelect, selected, featured }) {
  const meses = Math.round(plan.duracionDias / 30);
  return (
    <div className={`plan-card ${featured ? 'plan-featured' : ''} ${selected ? 'plan-card-selected' : ''}`}>
      {featured && <span className="plan-badge">Popular</span>}
      <h3>{plan.nombre}</h3>
      <p className="plan-price">${plan.precio.toFixed(2)}<span>/mes</span></p>
      <p className="plan-desc">{plan.descripcion}</p>
      <ul className="plan-features">
        <li>{plan.maxLibros ? `Hasta ${plan.maxLibros} libros` : 'Libros ilimitados'}</li>
        <li>{meses} meses de acceso</li>
        <li>Reseña y guarda libros</li>
        <li>Compra libros individuales</li>
      </ul>
      <button
        onClick={() => onSelect(plan._id)}
        className={`btn ${featured ? 'btn-primary' : 'btn-outline'} btn-lg`}
        disabled={selected}
      >
        {selected ? 'Suscribiendo...' : 'Suscribirse'}
      </button>
    </div>
  );
}
