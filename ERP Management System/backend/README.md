# ERP Management System - Backend

Production-grade ERP Management System backend built with Node.js, Express, and MongoDB.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Roles**: Admin, Sales, Purchase, Inventory
- **Complete ERP Modules**:
  - User Management
  - Product & Inventory Management
  - Customer Management
  - Supplier Management
  - Sales Orders
  - Purchase Orders
  - Goods Receipt Notes (GRN)
  - Invoicing with Payment Tracking
  - Dashboard Analytics & KPIs

## Tech Stack

- Node.js & Express.js
- MongoDB with Mongoose
- JWT Authentication
- Bcrypt password hashing
- Joi validation
- RESTful API design

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/erp_management
JWT_SECRET=your_secure_jwt_secret_key
JWT_EXPIRE=7d
```

4. Seed the database with sample data:
```bash
npm run seed
```

5. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

## Default Login Credentials

After seeding the database, use these credentials:

- **Admin**: admin@erp.com / admin123
- **Sales**: sales@erp.com / sales123
- **Purchase**: purchase@erp.com / purchase123
- **Inventory**: inventory@erp.com / inventory123

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (Protected)
- `PUT /api/auth/profile` - Update user profile (Protected)

### Users (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/alerts/low-stock` - Get low stock products
- `PATCH /api/products/:id/stock` - Update product stock

### Customers
- `GET /api/customers` - Get all customers
- `GET /api/customers/:id` - Get customer by ID
- `POST /api/customers` - Create customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Suppliers
- `GET /api/suppliers` - Get all suppliers
- `GET /api/suppliers/:id` - Get supplier by ID
- `POST /api/suppliers` - Create supplier
- `PUT /api/suppliers/:id` - Update supplier
- `DELETE /api/suppliers/:id` - Delete supplier

### Sales Orders
- `GET /api/sales-orders` - Get all sales orders
- `GET /api/sales-orders/:id` - Get sales order by ID
- `POST /api/sales-orders` - Create sales order
- `PUT /api/sales-orders/:id` - Update sales order
- `PATCH /api/sales-orders/:id/status` - Update order status
- `DELETE /api/sales-orders/:id` - Delete sales order

### Purchase Orders
- `GET /api/purchase-orders` - Get all purchase orders
- `GET /api/purchase-orders/:id` - Get purchase order by ID
- `POST /api/purchase-orders` - Create purchase order
- `PUT /api/purchase-orders/:id` - Update purchase order
- `PATCH /api/purchase-orders/:id/status` - Update order status
- `DELETE /api/purchase-orders/:id` - Delete purchase order

### GRNs (Goods Receipt Notes)
- `GET /api/grns` - Get all GRNs
- `GET /api/grns/:id` - Get GRN by ID
- `POST /api/grns` - Create GRN
- `PUT /api/grns/:id` - Update GRN
- `PATCH /api/grns/:id/approve` - Approve GRN and update stock
- `DELETE /api/grns/:id` - Delete GRN

### Invoices
- `GET /api/invoices` - Get all invoices
- `GET /api/invoices/:id` - Get invoice by ID
- `POST /api/invoices` - Create invoice
- `PUT /api/invoices/:id` - Update invoice
- `PATCH /api/invoices/:id/payment` - Record payment
- `DELETE /api/invoices/:id` - Delete invoice
- `GET /api/invoices/stats/overview` - Get invoice statistics

### Dashboard
- `GET /api/dashboard/overview` - Get dashboard overview
- `GET /api/dashboard/sales-trends` - Get sales trends
- `GET /api/dashboard/top-products` - Get top products
- `GET /api/dashboard/top-customers` - Get top customers
- `GET /api/dashboard/recent-activities` - Get recent activities
- `GET /api/dashboard/inventory-alerts` - Get inventory alerts

## Query Parameters

Most list endpoints support:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search term
- Additional filters (status, category, etc.)

Example: `GET /api/products?page=1&limit=20&search=laptop&category=Electronics`

## Role-Based Access Control

- **Admin**: Full access to all endpoints
- **Sales**: Access to customers, sales orders, and invoices
- **Purchase**: Access to suppliers, purchase orders, and GRNs
- **Inventory**: Access to products, GRNs, and stock management

## Error Handling

All endpoints return consistent error responses:

```json
{
  "message": "Error description",
  "stack": "Error stack trace (development only)"
}
```

HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Project Structure

```
backend/
├── config/           # Database configuration
├── controllers/      # Request handlers
├── middlewares/      # Custom middleware
├── models/           # Mongoose models
├── routes/           # API routes
├── utils/            # Helper functions
├── .env.example      # Environment variables template
├── .gitignore        # Git ignore file
├── package.json      # Dependencies
└── server.js         # App entry point
```

## Deployment

### Render Deployment

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables in Render dashboard
6. Deploy!

## Security Best Practices

- Use strong JWT secrets in production
- Enable HTTPS
- Set secure CORS policies
- Implement rate limiting
- Regular security audits
- Keep dependencies updated

## License

MIT
