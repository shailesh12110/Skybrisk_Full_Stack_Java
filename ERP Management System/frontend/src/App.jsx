import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/Routes/ProtectedRoute';

// Auth Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// Dashboard
import Dashboard from './pages/Dashboard/Dashboard';

// User Management
import UsersList from './pages/Users/UsersList';
import UserForm from './pages/Users/UserForm';

// Products
import ProductsList from './pages/Products/ProductsList';
import ProductForm from './pages/Products/ProductForm';

// Customers
import CustomersList from './pages/Customers/CustomersList';
import CustomerForm from './pages/Customers/CustomerForm';

// Suppliers
import SuppliersList from './pages/Suppliers/SuppliersList';
import SupplierForm from './pages/Suppliers/SupplierForm';

// Sales Orders
import SalesOrdersList from './pages/SalesOrders/SalesOrdersList';
import SalesOrderForm from './pages/SalesOrders/SalesOrderForm';
import SalesOrderView from './pages/SalesOrders/SalesOrderView';

// Purchase Orders
import PurchaseOrdersList from './pages/PurchaseOrders/PurchaseOrdersList';
import PurchaseOrderForm from './pages/PurchaseOrders/PurchaseOrderForm';
import PurchaseOrderView from './pages/PurchaseOrders/PurchaseOrderView';

// GRNs
import GRNsList from './pages/GRNs/GRNsList';
import GRNForm from './pages/GRNs/GRNForm';
import GRNView from './pages/GRNs/GRNView';

// Invoices
import InvoicesList from './pages/Invoices/InvoicesList';
import InvoiceForm from './pages/Invoices/InvoiceForm';
import InvoiceView from './pages/Invoices/InvoiceView';

function App() {
  const { user } = useSelector((state) => state.auth);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />

        {/* Users - Admin Only */}
        <Route path="users" element={<UsersList />} />
        <Route path="users/new" element={<UserForm />} />
        <Route path="users/edit/:id" element={<UserForm />} />

        {/* Products */}
        <Route path="products" element={<ProductsList />} />
        <Route path="products/new" element={<ProductForm />} />
        <Route path="products/edit/:id" element={<ProductForm />} />

        {/* Customers */}
        <Route path="customers" element={<CustomersList />} />
        <Route path="customers/new" element={<CustomerForm />} />
        <Route path="customers/edit/:id" element={<CustomerForm />} />

        {/* Suppliers */}
        <Route path="suppliers" element={<SuppliersList />} />
        <Route path="suppliers/new" element={<SupplierForm />} />
        <Route path="suppliers/edit/:id" element={<SupplierForm />} />

        {/* Sales Orders */}
        <Route path="sales-orders" element={<SalesOrdersList />} />
        <Route path="sales-orders/new" element={<SalesOrderForm />} />
        <Route path="sales-orders/edit/:id" element={<SalesOrderForm />} />
        <Route path="sales-orders/view/:id" element={<SalesOrderView />} />

        {/* Purchase Orders */}
        <Route path="purchase-orders" element={<PurchaseOrdersList />} />
        <Route path="purchase-orders/new" element={<PurchaseOrderForm />} />
        <Route path="purchase-orders/edit/:id" element={<PurchaseOrderForm />} />
        <Route path="purchase-orders/view/:id" element={<PurchaseOrderView />} />

        {/* GRNs */}
        <Route path="grns" element={<GRNsList />} />
        <Route path="grns/new" element={<GRNForm />} />
        <Route path="grns/view/:id" element={<GRNView />} />

        {/* Invoices */}
        <Route path="invoices" element={<InvoicesList />} />
        <Route path="invoices/new" element={<InvoiceForm />} />
        <Route path="invoices/view/:id" element={<InvoiceView />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
