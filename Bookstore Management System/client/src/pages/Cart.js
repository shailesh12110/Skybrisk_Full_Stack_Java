import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showCheckout, setShowCheckout] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    name: user?.name || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || '',
    phone: user?.phone || ''
  });
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async (e) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const orderData = {
        items: cartItems.map(item => ({
          book: item._id,
          quantity: item.quantity
        })),
        shippingAddress,
        paymentMethod
      };

      await axios.post('/api/orders', orderData);
      clearCart();
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="page-container">
        <div className="container">
          <h1 className="page-title">Shopping Cart</h1>
          <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <h2 style={{ marginBottom: '20px', color: '#666' }}>Your cart is empty</h2>
            <button className="btn btn-primary" onClick={() => navigate('/books')}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showCheckout) {
    return (
      <div className="page-container">
        <div className="container">
          <h1 className="page-title">Checkout</h1>
          {error && <div className="error" style={{ padding: '15px', background: '#fee', borderRadius: '5px', marginBottom: '20px' }}>{error}</div>}
          
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
            <div>
              <div className="card">
                <h2 style={{ marginBottom: '20px' }}>Shipping Address</h2>
                <form onSubmit={handleCheckout}>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={shippingAddress.name}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Street Address</label>
                    <input
                      type="text"
                      value={shippingAddress.street}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                      required
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div className="form-group">
                      <label>City</label>
                      <input
                        type="text"
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>State</label>
                      <input
                        type="text"
                        value={shippingAddress.state}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div className="form-group">
                      <label>Zip Code</label>
                      <input
                        type="text"
                        value={shippingAddress.zipCode}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Country</label>
                      <input
                        type="text"
                        value={shippingAddress.country}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      value={shippingAddress.phone}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Payment Method</label>
                    <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                      <option value="Cash on Delivery">Cash on Delivery</option>
                      <option value="Credit Card">Credit Card</option>
                      <option value="Debit Card">Debit Card</option>
                      <option value="UPI">UPI</option>
                      <option value="Net Banking">Net Banking</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
                    <button type="button" className="btn btn-secondary" onClick={() => setShowCheckout(false)}>
                      Back to Cart
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? 'Processing...' : 'Place Order'}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div>
              <div className="cart-summary">
                <h3>Order Summary</h3>
                {cartItems.map(item => (
                  <div key={item._id} style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
                    <p>{item.title}</p>
                    <p style={{ color: '#666', fontSize: '14px' }}>
                      ${item.price.toFixed(2)} x {item.quantity}
                    </p>
                  </div>
                ))}
                <div className="cart-total">
                  Total: ${getCartTotal().toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="container">
        <h1 className="page-title">Shopping Cart</h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
          <div>
            {cartItems.map(item => (
              <div key={item._id} className="cart-item card">
                <img
                  src={item.coverImage || 'https://via.placeholder.com/100x150'}
                  alt={item.title}
                />
                <div className="cart-item-details">
                  <h3 className="cart-item-title">{item.title}</h3>
                  <p style={{ color: '#666' }}>by {item.author}</p>
                  <p className="cart-item-price">${item.price.toFixed(2)}</p>
                  <div className="cart-quantity">
                    <label>Quantity:</label>
                    <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                  </div>
                  <p style={{ marginTop: '10px', fontWeight: '600' }}>
                    Subtotal: ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
                <button className="btn btn-danger" onClick={() => removeFromCart(item._id)}>
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div>
            <div className="cart-summary">
              <h3>Cart Summary</h3>
              <div style={{ margin: '20px 0', fontSize: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span>Items ({cartItems.reduce((sum, item) => sum + item.quantity, 0)}):</span>
                  <span>${getCartTotal().toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span>Shipping:</span>
                  <span>Free</span>
                </div>
              </div>
              <div className="cart-total">
                Total: ${getCartTotal().toFixed(2)}
              </div>
              <button 
                className="btn btn-primary" 
                style={{ width: '100%', marginTop: '20px', padding: '15px' }}
                onClick={() => setShowCheckout(true)}
              >
                Proceed to Checkout
              </button>
              <button 
                className="btn btn-secondary" 
                style={{ width: '100%', marginTop: '10px' }}
                onClick={() => navigate('/books')}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
