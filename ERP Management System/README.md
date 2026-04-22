# ERP Management System

A complete, production-grade ERP (Enterprise Resource Planning) Management System built with the MERN stack.

## 🚀 Overview

This is a full-featured ERP system designed for small to medium-sized businesses. It includes comprehensive modules for inventory management, sales, purchasing, customer relationship management, and financial operations.

## ✨ Key Features

### Core Modules
- **User Management**: Role-based access control (Admin, Sales, Purchase, Inventory)
- **Product & Inventory**: SKU management, stock tracking, reorder alerts
- **Customer Management**: Contact management, credit limits, order history
- **Supplier Management**: Vendor database, payment terms, purchase tracking
- **Sales Orders**: Order creation, status tracking, fulfillment
- **Purchase Orders**: Procurement management, receiving, approval workflow
- **GRNs (Goods Receipt Notes)**: Quality inspection, stock updates
- **Invoicing**: Invoice generation, payment tracking, PDF export
- **Dashboard & Analytics**: Real-time KPIs, charts, trends

### Technical Features
- JWT-based authentication
- Role-based authorization
- RESTful API design
- MongoDB with Mongoose ODM
- React with Material-UI
- Redux Toolkit for state management
- Form validation (Joi/Yup)
- PDF generation
- Responsive design
- Search, filter, and pagination
- Error handling and logging

## 🛠 Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB & Mongoose
- JWT Authentication
- Bcrypt password hashing
- Joi validation

### Frontend
- React 18
- Redux Toolkit
- React Router v6
- Material-UI
- Formik & Yup
- Axios
- Recharts
- jsPDF

## 📋 Prerequisites

- Node.js (v16+)
- MongoDB (v4.4+)
- npm or yarn

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone <repository-url>
cd ERM
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Update .env with your MongoDB URI and JWT secret
# Example:
# MONGODB_URI=mongodb://localhost:27017/erp_management
# JWT_SECRET=your_secure_secret_key

# Seed the database
npm run seed

# Start the server
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install

# Create .env file
cp .env.example .env

# Update .env with API URL
# VITE_API_URL=http://localhost:5000/api

# Start the dev server
npm run dev
```

Frontend will run on `http://localhost:3000`

### 4. Login

After seeding the database, use these credentials:

- **Admin**: `admin@erp.com` / `admin123`
- **Sales**: `sales@erp.com` / `sales123`
- **Purchase**: `purchase@erp.com` / `purchase123`
- **Inventory**: `inventory@erp.com` / `inventory123`

## 📁 Project Structure

```
ERM/
├── backend/                 # Node.js/Express backend
│   ├── config/             # Database configuration
│   ├── controllers/        # Request handlers
│   ├── middlewares/        # Auth, error handling
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   ├── utils/              # Helpers, validation
│   ├── .env.example        # Environment template
│   ├── package.json        # Backend dependencies
│   └── server.js           # Entry point
│
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── redux/         # State management
│   │   ├── services/      # API services
│   │   ├── App.jsx        # Main app
│   │   └── main.jsx       # Entry point
│   ├── .env.example       # Environment template
│   ├── package.json       # Frontend dependencies
│   └── vite.config.js     # Vite configuration
│
└── README.md              # This file
```

## 🔐 Security Features

- Bcrypt password hashing
- JWT token authentication
- Role-based access control
- Protected API endpoints
- Input validation
- SQL injection prevention (NoSQL)
- XSS protection
- CORS configuration

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get profile
- `PUT /api/auth/profile` - Update profile

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/alerts/low-stock` - Low stock alerts

### Customers
- `GET /api/customers` - Get all customers
- `POST /api/customers` - Create customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Suppliers
- `GET /api/suppliers` - Get all suppliers
- `POST /api/suppliers` - Create supplier
- `PUT /api/suppliers/:id` - Update supplier
- `DELETE /api/suppliers/:id` - Delete supplier

### Sales Orders
- `GET /api/sales-orders` - Get all orders
- `POST /api/sales-orders` - Create order
- `PUT /api/sales-orders/:id` - Update order
- `PATCH /api/sales-orders/:id/status` - Update status
- `DELETE /api/sales-orders/:id` - Delete order

### Purchase Orders
- `GET /api/purchase-orders` - Get all POs
- `POST /api/purchase-orders` - Create PO
- `PUT /api/purchase-orders/:id` - Update PO
- `PATCH /api/purchase-orders/:id/status` - Update status
- `DELETE /api/purchase-orders/:id` - Delete PO

### GRNs
- `GET /api/grns` - Get all GRNs
- `POST /api/grns` - Create GRN
- `PUT /api/grns/:id` - Update GRN
- `PATCH /api/grns/:id/approve` - Approve & update stock
- `DELETE /api/grns/:id` - Delete GRN

### Invoices
- `GET /api/invoices` - Get all invoices
- `POST /api/invoices` - Create invoice
- `PUT /api/invoices/:id` - Update invoice
- `PATCH /api/invoices/:id/payment` - Record payment
- `DELETE /api/invoices/:id` - Delete invoice
- `GET /api/invoices/stats/overview` - Invoice statistics

### Dashboard
- `GET /api/dashboard/overview` - Dashboard stats
- `GET /api/dashboard/sales-trends` - Sales trends
- `GET /api/dashboard/top-products` - Top products
- `GET /api/dashboard/top-customers` - Top customers

## 🎨 UI Screenshots

*(Add screenshots of your application here)*

- Dashboard with KPIs
- Products list with search
- Sales order form
- Invoice PDF

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📦 Deployment

### Backend (Render)
1. Create a new Web Service on Render
2. Connect your GitHub repo
3. Build command: `cd backend && npm install`
4. Start command: `cd backend && npm start`
5. Add environment variables
6. Deploy

### Frontend (Vercel)
1. Install Vercel CLI: `npm i -g vercel`
2. Navigate to frontend: `cd frontend`
3. Deploy: `vercel`
4. Set environment variables in Vercel dashboard

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Material-UI for the beautiful component library
- MongoDB for the flexible database
- Express.js for the robust backend framework
- React community for amazing tools and libraries

## 📞 Support

For issues, questions, or contributions, please open an issue on GitHub.

---

**Built with ❤️ using the MERN Stack**
