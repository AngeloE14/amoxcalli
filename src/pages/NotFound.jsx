import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="not-found">
      <h1>404</h1>
      <p>Página no encontrada</p>
      <Link to="/" className="btn btn-primary btn-lg">Volver al inicio</Link>
    </div>
  );
}
