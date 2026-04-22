import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await axios.delete(`/api/orders/${orderId}`);
        fetchOrders();
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to cancel order');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  return (
    <div className="page-container">
      <div className="container">
        <h1 className="page-title">My Orders</h1>
        
        {orders.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <h2 style={{ marginBottom: '20px', color: '#666' }}>No orders yet</h2>
            <button className="btn btn-primary" onClick={() => navigate('/books')}>
              Start Shopping
            </button>
          </div>
        ) : (
          <div>
            {orders.map(order => (
              <div key={order._id} className="order-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div>
                    <h3 style={{ marginBottom: '5px' }}>Order #{order._id.slice(-8)}</h3>
                    <p style={{ color: '#666' }}>
                      Placed on {new Date(order.orderDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`order-status ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ marginBottom: '10px' }}>Items:</h4>
                  {order.items.map((item, index) => (
                    <div key={index} style={{ padding: '10px', background: '#f8f9fa', borderRadius: '5px', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                          <p style={{ fontWeight: '600' }}>{item.book?.title || 'Book'}</p>
                          <p style={{ color: '#666', fontSize: '14px' }}>
                            by {item.book?.author || 'Unknown'}
                          </p>
                          <p style={{ fontSize: '14px', marginTop: '5px' }}>
                            Quantity: {item.quantity} × ${item.price.toFixed(2)}
                          </p>
                        </div>
                        <p style={{ fontWeight: '600', fontSize: '18px' }}>
                          ${(item.quantity * item.price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ marginBottom: '10px' }}>Shipping Address:</h4>
                  <p>{order.shippingAddress.name}</p>
                  <p>{order.shippingAddress.street}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                  <p>Phone: {order.shippingAddress.phone}</p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid #eee', paddingTop: '20px' }}>
                  <div>
                    <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                    <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
                      Total: ${order.totalAmount.toFixed(2)}
                    </p>
                    {(order.status === 'Pending' || order.status === 'Processing') && (
                      <button
                        className="btn btn-danger"
                        onClick={() => handleCancelOrder(order._id)}
                        style={{ marginTop: '10px' }}
                      >
                        Cancel Order
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

export default Orders;
