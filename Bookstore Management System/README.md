# Bookstore Management System

A full-stack bookstore management system with REST API built using Node.js, Express, MongoDB, and React.

## Features

### Customer Features
- **User Authentication**: Registration and login with JWT
- **Browse Books**: Search and filter books by category, author, or keywords
- **Book Details**: View detailed information about books including reviews
- **Shopping Cart**: Add books to cart and manage quantities
- **Order Management**: Place orders and track order status
- **User Profile**: Update profile information and address
- **Book Reviews**: Rate and review purchased books

### Admin Features
- **Book Management**: Add, edit, and delete books
- **Order Management**: View all orders and update order status
- **User Management**: View and manage users
- **Inventory Management**: Update stock levels

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Context API** - State management

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Backend Setup

1. Install backend dependencies:
```bash
npm install
```

2. Configure environment variables:
   - Copy `.env` file and update the values:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/bookstore
   JWT_SECRET=your_jwt_secret_key_here_change_in_production
   NODE_ENV=development
   ```

3. Make sure MongoDB is running on your system

### Frontend Setup

1. Navigate to the client folder and install dependencies:
```bash
cd client
npm install
```

## Running the Application

### Start MongoDB
Make sure MongoDB is running on your system:
```bash
# On macOS with Homebrew
brew services start mongodb-community

# Or manually
mongod
```

### Start Backend Server
From the root directory:
```bash
npm run dev
```
The backend server will start on http://localhost:5000

### Start Frontend
In a new terminal, from the root directory:
```bash
npm run client
```
The React app will start on http://localhost:3000

### Run Both Concurrently
To run both backend and frontend together (requires concurrent package):
```bash
npm run install-all
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Books
- `GET /api/books` - Get all books (with filters and pagination)
- `GET /api/books/:id` - Get single book
- `POST /api/books` - Create book (Admin only)
- `PUT /api/books/:id` - Update book (Admin only)
- `DELETE /api/books/:id` - Delete book (Admin only)
- `POST /api/books/:id/reviews` - Add review (Authenticated users)

### Orders
- `GET /api/orders` - Get all orders (Admin) or user orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create order
- `PUT /api/orders/:id/status` - Update order status (Admin only)
- `DELETE /api/orders/:id` - Cancel order

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `DELETE /api/users/:id` - Delete user (Admin only)

## Default Admin Account

To create an admin account, you need to manually update a user document in MongoDB:

1. Register a new user through the application
2. Connect to MongoDB:
```bash
mongosh
use bookstore
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

## Project Structure

```
bookstore-management-system/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Book.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── books.js
│   │   ├── orders.js
│   │   └── users.js
│   ├── middleware/
│   │   └── auth.js
│   └── server.js
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.js
│   │   ├── context/
│   │   │   ├── AuthContext.js
│   │   │   └── CartContext.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Books.js
│   │   │   ├── BookDetails.js
│   │   │   ├── Cart.js
│   │   │   ├── Orders.js
│   │   │   ├── Profile.js
│   │   │   └── AdminDashboard.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── .env
├── .gitignore
├── package.json
└── README.md
```

## Features Overview

### User Registration & Authentication
- Secure password hashing
- JWT token-based authentication
- Protected routes for authenticated users
- Role-based access control (user/admin)

### Book Catalog
- Complete CRUD operations for books
- Category-based filtering
- Search functionality
- Stock management
- Book ratings and reviews

### Shopping Cart
- Add/remove items
- Update quantities
- Persistent cart (localStorage)
- Real-time total calculation

### Order Processing
- Order creation with validation
- Stock updates on order placement
- Order tracking
- Order status updates (Admin)
- Order cancellation

### Admin Panel
- Manage books inventory
- View and update orders
- Manage users
- Full CRUD operations

## Security Features
- Password hashing with bcryptjs
- JWT authentication
- Protected API endpoints
- Input validation
- Role-based authorization

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the ISC License.

## Support
For issues and questions, please create an issue on the GitHub repository.
