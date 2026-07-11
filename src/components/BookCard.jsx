import { Link } from 'react-router-dom';

export default function TarjetaLibro({ book }) {
  return (
    <Link to={`/books/${book._id}`} className="book-card">
      <div className="book-card-cover">
        {book.coverUrl ? (
          <img src={book.coverUrl} alt={book.title} loading="lazy" />
        ) : (
          <div className="book-card-placeholder">{book.title[0]}</div>
        )}
      </div>
      <div className="book-card-info">
        <h3>{book.title}</h3>
        <p className="book-card-author">{book.author}</p>
        <div className="book-card-bottom">
          <span className="book-card-genre">{book.genre}</span>
          {book.price != null && <span className="book-card-price">${book.price.toFixed(2)} MXN</span>}
        </div>
      </div>
    </Link>
  );
}
