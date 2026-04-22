# ERP Management System - Frontend

Modern, responsive React frontend for the ERP Management System built with Material-UI and Redux Toolkit.

## Features

- **Modern UI**: Clean, professional interface with Material-UI components
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Authentication**: Secure JWT-based authentication with role-based access
- **Dashboard**: Real-time KPIs, charts, and analytics
- **Complete CRUD Operations**: Full create, read, update, delete for all modules
- **Advanced Features**:
  - Real-time search and filtering
  - Pagination
  - Form validation with Formik & Yup
  - Toast notifications
  - Protected routes
  - PDF export (invoices)

## Tech Stack

- **React 18**: Latest React features
- **Redux Toolkit**: State management
- **React Router v6**: Client-side routing
- **Material-UI**: Component library
- **Formik & Yup**: Form handling and validation
- **Recharts**: Data visualization
- **Axios**: HTTP client
- **jsPDF**: PDF generation
- **React Toastify**: Toast notifications
- **Vite**: Fast build tool

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running

### Installation

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your API URL:
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Layout/         # Layout components (Sidebar, Topbar)
│   │   └── Routes/         # Route protection
│   ├── pages/              # Page components
│   │   ├── Auth/           # Login, Register
│   │   ├── Dashboard/      # Dashboard with analytics
│   │   ├── Products/       # Product management
│   │   ├── Customers/      # Customer management
│   │   ├── Suppliers/      # Supplier management
│   │   ├── SalesOrders/    # Sales order management
│   │   ├── PurchaseOrders/ # Purchase order management
│   │   ├── GRNs/           # Goods Receipt Notes
│   │   ├── Invoices/       # Invoice management
│   │   └── Users/          # User management (Admin)
│   ├── redux/              # Redux store and slices
│   │   ├── slices/         # Redux slices for each module
│   │   └── store.js        # Redux store configuration
│   ├── services/           # API services
│   │   ├── api.js          # Axios configuration
│   │   ├── authService.js  # Authentication API
│   │   └── ...             # Other service files
│   ├── App.jsx             # Main app component with routes
│   └── main.jsx            # App entry point
├── index.html              # HTML template
├── vite.config.js          # Vite configuration
└── package.json            # Dependencies
```

## Features by Module

### Authentication
- Login with email and password
- JWT token management
- Auto-redirect on authentication
- Secure logout

### Dashboard
- Overview statistics (products, customers, orders, revenue)
- Sales trends chart
- Alerts for low stock and overdue invoices
- Top products and customers
- Recent activities

### Products
- Full CRUD operations
- Search and filter by category
- Low stock alerts
- SKU management
- Price and inventory tracking

### Customers & Suppliers
- Contact management
- Address information
- Credit limit tracking (customers)
- Payment terms (suppliers)

### Sales Orders
- Create orders from customer selection
- Line item management
- Order status tracking
- Automatic calculations
- Link to invoices

### Purchase Orders
- Create POs for suppliers
- Track order status
- Receive items via GRN
- Status updates

### GRNs (Goods Receipt Notes)
- Record received goods
- Quality inspection
- Accept/reject quantities
- Auto-update inventory
- Link to purchase orders

### Invoices
- Generate from sales orders
- Payment tracking
- PDF export
- Payment status management
- Overdue tracking

## Role-Based Access Control

- **Admin**: Full access to all modules
- **Sales**: Customers, Sales Orders, Invoices
- **Purchase**: Suppliers, Purchase Orders, GRNs
- **Inventory**: Products, GRNs, Stock Management

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

```env
VITE_API_URL=http://localhost:5000/api  # Backend API URL
```

## Building for Production

```bash
npm run build
```

The optimized production build will be in the `dist/` directory.

## Deployment

### Vercel Deployment

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variables in Vercel dashboard:
   - `VITE_API_URL`: Your production API URL

### Manual Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist/` folder to your hosting provider

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimizations

- Code splitting with React Router
- Lazy loading of routes
- Redux state management
- Memoization where needed
- Optimized Material-UI imports

## Best Practices Implemented

- Component-based architecture
- Separation of concerns
- Reusable components
- Centralized state management
- API service abstraction
- Protected routes
- Form validation
- Error handling
- Loading states
- Responsive design

## Troubleshooting

### Common Issues

1. **API connection error**:
   - Check if backend server is running
   - Verify `VITE_API_URL` in `.env`
   - Check CORS settings on backend

2. **Authentication issues**:
   - Clear localStorage
   - Check JWT token expiration
   - Verify backend auth endpoints

3. **Build errors**:
   - Delete `node_modules` and reinstall
   - Clear Vite cache: `rm -rf node_modules/.vite`

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

MIT
