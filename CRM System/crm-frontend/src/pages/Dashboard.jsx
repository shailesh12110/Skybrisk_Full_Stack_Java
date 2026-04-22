import { useState, useEffect } from 'react';
import { customerAPI, leadAPI, taskAPI, saleAPI } from '../services/api';
import Navbar from '../components/Navbar';

function Dashboard() {
  const [stats, setStats] = useState({
    customers: 0,
    leads: 0,
    tasks: 0,
    sales: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [customersRes, leadsRes, tasksRes, salesRes] = await Promise.all([
        customerAPI.getAll(),
        leadAPI.getAll(),
        taskAPI.getAll(),
        saleAPI.getAll(),
      ]);

      setStats({
        customers: customersRes.data.length,
        leads: leadsRes.data.length,
        tasks: tasksRes.data.length,
        sales: salesRes.data.length,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading">Loading dashboard...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="dashboard">
        <h2>Dashboard</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Customers</h3>
            <div className="stat-value">{stats.customers}</div>
          </div>
          <div className="stat-card">
            <h3>Total Leads</h3>
            <div className="stat-value">{stats.leads}</div>
          </div>
          <div className="stat-card">
            <h3>Total Tasks</h3>
            <div className="stat-value">{stats.tasks}</div>
          </div>
          <div className="stat-card">
            <h3>Total Sales</h3>
            <div className="stat-value">{stats.sales}</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
