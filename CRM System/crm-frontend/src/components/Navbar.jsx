import { Link, useNavigate } from 'react-router-dom';
import { getUser, logout } from '../utils/auth';

function Navbar() {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="navbar">
      <div className="navbar-content">
        <h1>CRM System</h1>
        <nav>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/customers">Customers</Link>
          <Link to="/leads">Leads</Link>
          <Link to="/tasks">Tasks</Link>
          <Link to="/sales">Sales</Link>
          <span style={{ color: '#95a5a6', marginLeft: '1rem' }}>
            {user?.fullName} ({user?.role})
          </span>
          <button onClick={handleLogout}>Logout</button>
        </nav>
      </div>
    </div>
  );
}

export default Navbar;
