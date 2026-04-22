import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="page-container">
      <div className="container">
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <h1 style={{ fontSize: '48px', marginBottom: '20px', color: '#333' }}>
            Welcome to Bookstore
          </h1>
          <p style={{ fontSize: '20px', color: '#666', marginBottom: '40px' }}>
            Discover your next favorite book from our vast collection
          </p>
          <Link to="/books">
            <button className="btn btn-primary" style={{ padding: '15px 40px', fontSize: '18px' }}>
              Browse Books
            </button>
          </Link>
        </div>

        <div className="grid grid-3" style={{ marginTop: '60px' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '24px', marginBottom: '15px' }}>📚 Wide Selection</h3>
            <p style={{ color: '#666' }}>Browse through thousands of books across various genres</p>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '24px', marginBottom: '15px' }}>🚚 Fast Delivery</h3>
            <p style={{ color: '#666' }}>Get your books delivered right to your doorstep</p>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '24px', marginBottom: '15px' }}>💳 Secure Payment</h3>
            <p style={{ color: '#666' }}>Multiple payment options with secure transactions</p>
          </div>
        </div>

        <div className="card" style={{ marginTop: '60px', padding: '40px', textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <h2 style={{ fontSize: '32px', marginBottom: '20px' }}>Join Our Community</h2>
          <p style={{ fontSize: '18px', marginBottom: '30px' }}>
            Sign up today and start building your personal library
          </p>
          <Link to="/register">
            <button className="btn" style={{ background: 'white', color: '#667eea', padding: '15px 40px', fontSize: '18px' }}>
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
