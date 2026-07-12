import { Link } from 'react-router-dom';

export default function TarjetaLibro({ book }) {
  return (
    <Link to={`/books/${book._id}`} className="book-card">
      <div className="book-card-cover">
        {book.portada ? (
          <img src={book.portada} alt={book.titulo} loading="lazy" />
        ) : (
          <div className="book-card-placeholder">{book.titulo[0]}</div>
        )}
      </div>
      <div className="book-card-info">
        <h3>{book.titulo}</h3>
        <p className="book-card-author">{book.autor}</p>
        <div className="book-card-bottom">
          <span className="book-card-genre">{book.genero}</span>
          {book.precio != null && <span className="book-card-price">${book.precio.toFixed(2)} MXN</span>}
        </div>
      </div>
    </Link>
  );
}
