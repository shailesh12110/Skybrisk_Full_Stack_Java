import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { saleAPI, customerAPI } from '../services/api';
import { getUser } from '../utils/auth';

function Sales() {
  const [sales, setSales] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSale, setEditingSale] = useState(null);
  const [formData, setFormData] = useState({
    customerId: '',
    amount: '',
    status: 'PROPOSAL',
    date: '',
    notes: '',
  });

  const user = getUser();

  useEffect(() => {
    fetchSales();
    fetchCustomers();
  }, []);

  const fetchSales = async () => {
    try {
      const response = await saleAPI.getAll();
      setSales(response.data);
    } catch (error) {
      console.error('Error fetching sales:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await customerAPI.getAll();
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const saleData = {
        customer: { id: parseInt(formData.customerId) },
        amount: parseFloat(formData.amount),
        status: formData.status,
        date: formData.date,
        notes: formData.notes,
      };

      if (editingSale) {
        await saleAPI.update(editingSale.id, saleData);
      } else {
        await saleAPI.create(saleData);
      }
      fetchSales();
      closeModal();
    } catch (error) {
      console.error('Error saving sale:', error);
      alert('Error saving sale');
    }
  };

  const handleEdit = (sale) => {
    setEditingSale(sale);
    setFormData({
      customerId: sale.customer?.id || '',
      amount: sale.amount || '',
      status: sale.status || 'PROPOSAL',
      date: sale.date || '',
      notes: sale.notes || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this sale?')) {
      try {
        await saleAPI.delete(id);
        fetchSales();
      } catch (error) {
        console.error('Error deleting sale:', error);
        alert('Error deleting sale. You may not have permission.');
      }
    }
  };

  const openModal = () => {
    setEditingSale(null);
    setFormData({
      customerId: '',
      amount: '',
      status: 'PROPOSAL',
      date: '',
      notes: '',
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSale(null);
  };

  const getStatusClass = (status) => {
    const statusMap = {
      PROPOSAL: 'status-new',
      NEGOTIATION: 'status-contacted',
      CLOSED_WON: 'status-converted',
      CLOSED_LOST: 'status-lost',
    };
    return statusMap[status] || '';
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading">Loading sales...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="data-table-container">
          <div className="table-header">
            <h2>Sales</h2>
            <button className="btn btn-success" onClick={openModal}>
              Add Sale
            </button>
          </div>
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sales.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center' }}>
                    No sales found
                  </td>
                </tr>
              ) : (
                sales.map((sale) => (
                  <tr key={sale.id}>
                    <td>{sale.customer?.name || 'N/A'}</td>
                    <td>${sale.amount?.toFixed(2)}</td>
                    <td>{sale.date}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(sale.status)}`}>
                        {sale.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td>{sale.notes}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-edit"
                          onClick={() => handleEdit(sale)}
                        >
                          Edit
                        </button>
                        {user?.role === 'ADMIN' && (
                          <button
                            className="btn-delete"
                            onClick={() => handleDelete(sale.id)}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingSale ? 'Edit Sale' : 'Add Sale'}</h3>
              <button className="close-btn" onClick={closeModal}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Customer *</label>
                <select
                  name="customerId"
                  value={formData.customerId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a customer</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Amount *</label>
                <input
                  type="number"
                  step="0.01"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Status *</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                >
                  <option value="PROPOSAL">Proposal</option>
                  <option value="NEGOTIATION">Negotiation</option>
                  <option value="CLOSED_WON">Closed Won</option>
                  <option value="CLOSED_LOST">Closed Lost</option>
                </select>
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingSale ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Sales;
