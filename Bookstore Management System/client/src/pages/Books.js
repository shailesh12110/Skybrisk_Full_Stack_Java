import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');
  
  const { addToCart } = useContext(CartContext);

  const categories = ['Fiction', 'Non-Fiction', 'Science', 'Technology', 'History', 'Biography', 'Self-Help', 'Children', 'Other'];

  useEffect(() => {
    fetchBooks();
  }, [category]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const params = {};
      if (category) params.category = category;
      if (search) params.search = search;
      
      const response = await axios.get('/api/books', { params });
      setBooks(response.data.books);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBooks();
  };

  const handleAddToCart = (book) => {
    addToCart(book);
    setMessage(`${book.title} added to cart!`);
    setTimeout(() => setMessage(''), 3000);
  };

  if (loading) {
    return <div className="loading">Loading books...</div>;
  }

  return (
    <div className="page-container">
      <div className="container">
        <h1 className="page-title">Browse Books</h1>
        
        {message && (
          <div style={{ padding: '15px', background: '#d4edda', color: '#155724', borderRadius: '5px', marginBottom: '20px' }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSearch} className="search-bar">
          <input
            type="text"
            placeholder="Search books by title, author, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">Search</button>
        </form>

        <div className="filters">
          <button
            className={`filter-btn ${category === '' ? 'active' : ''}`}
            onClick={() => setCategory('')}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {books.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', fontSize: '18px', color: '#666' }}>
            No books found. Try adjusting your search or filters.
          </div>
        ) : (
          <div className="grid grid-4">
            {books.map(book => (
              <div key={book._id} className="book-card">
                <img
                  src={book.coverImage || 'https://via.placeholder.com/300x400?text=No+Image'}
                  alt={book.title}
                />
                <div className="book-card-content">
                  <span className="book-card-category">{book.category}</span>
                  <h3 className="book-card-title">{book.title}</h3>
                  <p className="book-card-author">by {book.author}</p>
                  <div className="rating">
                    {'⭐'.repeat(Math.round(book.rating))}
                    {book.rating > 0 && ` (${book.rating.toFixed(1)})`}
                  </div>
                  <p className="book-card-price">${book.price.toFixed(2)}</p>
                  <p style={{ fontSize: '14px', color: book.stock > 0 ? '#28a745' : '#dc3545', marginBottom: '10px' }}>
                    {book.stock > 0 ? `In Stock (${book.stock})` : 'Out of Stock'}
                  </p>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <Link to={`/books/${book._id}`} style={{ flex: 1 }}>
                      <button className="btn btn-secondary" style={{ width: '100%' }}>
                        View Details
                      </button>
                    </Link>
                    {book.stock > 0 && (
                      <button
                        className="btn btn-primary"
                        onClick={() => handleAddToCart(book)}
                        style={{ flex: 1 }}
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Books;
