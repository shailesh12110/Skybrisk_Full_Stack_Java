import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [message, setMessage] = useState('');
  
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      const response = await axios.get(`/api/books/${id}`);
      setBook(response.data);
    } catch (error) {
      console.error('Error fetching book:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(book, quantity);
    setMessage('Book added to cart!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await axios.post(`/api/books/${id}/reviews`, review);
      setMessage('Review submitted successfully!');
      setReview({ rating: 5, comment: '' });
      fetchBook();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to submit review');
    }
  };

  if (loading) {
    return <div className="loading">Loading book details...</div>;
  }

  if (!book) {
    return <div className="loading">Book not found</div>;
  }

  return (
    <div className="page-container">
      <div className="container">
        {message && (
          <div style={{ padding: '15px', background: '#d4edda', color: '#155724', borderRadius: '5px', marginBottom: '20px' }}>
            {message}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px', marginBottom: '40px' }}>
          <div>
            <img
              src={book.coverImage || 'https://via.placeholder.com/400x600?text=No+Image'}
              alt={book.title}
              style={{ width: '100%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
            />
          </div>
          
          <div>
            <span className="book-card-category">{book.category}</span>
            <h1 style={{ fontSize: '36px', margin: '15px 0', color: '#333' }}>{book.title}</h1>
            <h3 style={{ fontSize: '20px', color: '#666', marginBottom: '15px' }}>by {book.author}</h3>
            
            <div className="rating" style={{ marginBottom: '20px' }}>
              {'⭐'.repeat(Math.round(book.rating))}
              {book.rating > 0 && ` ${book.rating.toFixed(1)} (${book.reviews?.length || 0} reviews)`}
            </div>

            <div style={{ fontSize: '18px', marginBottom: '20px' }}>
              <p><strong>ISBN:</strong> {book.isbn}</p>
              <p><strong>Publisher:</strong> {book.publisher || 'N/A'}</p>
              <p><strong>Language:</strong> {book.language}</p>
              <p><strong>Pages:</strong> {book.pages || 'N/A'}</p>
              {book.publishedDate && (
                <p><strong>Published:</strong> {new Date(book.publishedDate).toLocaleDateString()}</p>
              )}
            </div>

            <p className="book-card-price" style={{ fontSize: '32px', marginBottom: '20px' }}>
              ${book.price.toFixed(2)}
            </p>

            <p style={{ fontSize: '16px', color: book.stock > 0 ? '#28a745' : '#dc3545', marginBottom: '20px', fontWeight: '600' }}>
              {book.stock > 0 ? `In Stock (${book.stock} available)` : 'Out of Stock'}
            </p>

            {book.stock > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <div className="cart-quantity" style={{ marginBottom: '15px' }}>
                  <label style={{ marginRight: '15px', fontWeight: '600' }}>Quantity:</label>
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                  <span style={{ padding: '0 20px', fontSize: '18px' }}>{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(book.stock, quantity + 1))}>+</button>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={handleAddToCart}
                  style={{ padding: '15px 40px', fontSize: '18px' }}
                >
                  Add to Cart
                </button>
              </div>
            )}

            <div className="card" style={{ marginTop: '30px' }}>
              <h3 style={{ marginBottom: '15px' }}>Description</h3>
              <p style={{ lineHeight: '1.6', color: '#555' }}>{book.description}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 style={{ marginBottom: '20px' }}>Customer Reviews</h2>
          
          {user && (
            <form onSubmit={handleReviewSubmit} style={{ marginBottom: '30px', padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
              <h3 style={{ marginBottom: '15px' }}>Write a Review</h3>
              <div className="form-group">
                <label>Rating</label>
                <select
                  value={review.rating}
                  onChange={(e) => setReview({ ...review, rating: parseInt(e.target.value) })}
                >
                  <option value="5">5 Stars - Excellent</option>
                  <option value="4">4 Stars - Good</option>
                  <option value="3">3 Stars - Average</option>
                  <option value="2">2 Stars - Below Average</option>
                  <option value="1">1 Star - Poor</option>
                </select>
              </div>
              <div className="form-group">
                <label>Comment</label>
                <textarea
                  value={review.comment}
                  onChange={(e) => setReview({ ...review, comment: e.target.value })}
                  rows="4"
                  required
                  placeholder="Share your thoughts about this book..."
                />
              </div>
              <button type="submit" className="btn btn-primary">Submit Review</button>
            </form>
          )}

          {book.reviews && book.reviews.length > 0 ? (
            <div>
              {book.reviews.map((review, index) => (
                <div key={index} style={{ padding: '20px', borderBottom: '1px solid #eee', marginBottom: '15px' }}>
                  <div style={{ marginBottom: '10px' }}>
                    <div className="rating">{'⭐'.repeat(review.rating)}</div>
                    <p style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <p style={{ lineHeight: '1.6' }}>{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#666' }}>No reviews yet. Be the first to review this book!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
