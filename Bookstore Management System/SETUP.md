# Bookstore Management System - Setup Guide

## Quick Start Guide

Follow these steps to get the Bookstore Management System up and running:

### 1. Prerequisites Check

Make sure you have the following installed:
- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download here](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** (comes with Node.js)

Verify installations:
```bash
node --version
npm --version
mongod --version
```

### 2. Install Dependencies

From the project root directory:

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

Or use the shortcut:
```bash
npm run install-all
```

### 3. Configure Environment

The `.env` file is already created with default values. Update if needed:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bookstore
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=development
```

**Important**: Change `JWT_SECRET` for production!

### 4. Start MongoDB

#### On macOS (with Homebrew):
```bash
brew services start mongodb-community
```

#### On Windows:
```bash
# MongoDB should start automatically if installed as a service
# Or run manually:
"C:\Program Files\MongoDB\Server\{version}\bin\mongod.exe"
```

#### On Linux:
```bash
sudo systemctl start mongod
# Or
sudo service mongod start
```

### 5. Seed the Database (Optional but Recommended)

This will populate the database with sample books and create test accounts:

```bash
npm run seed
```

This creates:
- **Admin Account**: 
  - Email: `admin@bookstore.com`
  - Password: `admin123`

- **User Account**:
  - Email: `user@bookstore.com`
  - Password: `user123`

- **10 Sample Books** across different categories

### 6. Start the Application

#### Option A: Run Backend and Frontend Separately

**Terminal 1** (Backend):
```bash
npm run dev
```
Backend runs on: http://localhost:5000

**Terminal 2** (Frontend):
```bash
npm run client
```
Frontend runs on: http://localhost:3000

#### Option B: Run Both Together (Recommended)
Install concurrently first:
```bash
npm install -g concurrently
```

Then add this script to `package.json`:
```json
"dev-all": "concurrently \"npm run server\" \"npm run client\""
```

Run:
```bash
npm run dev-all
```

### 7. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## Testing the Application

### As a Customer:

1. **Register a new account** or login with:
   - Email: `user@bookstore.com`
   - Password: `user123`

2. **Browse Books**:
   - Search for books
   - Filter by category
   - View book details

3. **Shopping**:
   - Add books to cart
   - Update quantities
   - Checkout and place order

4. **Manage Orders**:
   - View order history
   - Track order status
   - Cancel pending orders

5. **Leave Reviews**:
   - Rate books
   - Write reviews

### As an Admin:

1. **Login with admin credentials**:
   - Email: `admin@bookstore.com`
   - Password: `admin123`

2. **Access Admin Dashboard**:
   - Click on "Admin" in the navigation

3. **Manage Books**:
   - Add new books
   - Edit existing books
   - Delete books
   - Update stock

4. **Manage Orders**:
   - View all orders
   - Update order status
   - Process orders

5. **Manage Users**:
   - View all users
   - Delete users

## API Testing (Optional)

You can test the API endpoints using tools like:
- **Postman** - [Download here](https://www.postman.com/downloads/)
- **Thunder Client** (VS Code extension)
- **curl** (command line)

### Example API Tests:

#### 1. Register a new user:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "test123"
  }'
```

#### 2. Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@bookstore.com",
    "password": "admin123"
  }'
```

#### 3. Get all books:
```bash
curl http://localhost:5000/api/books
```

#### 4. Get books by category:
```bash
curl "http://localhost:5000/api/books?category=Fiction"
```

#### 5. Search books:
```bash
curl "http://localhost:5000/api/books?search=gatsby"
```

## Troubleshooting

### MongoDB Connection Error
**Problem**: Cannot connect to MongoDB

**Solutions**:
1. Make sure MongoDB is running:
   ```bash
   # Check if MongoDB is running
   ps aux | grep mongod  # On macOS/Linux
   ```

2. Check MongoDB connection string in `.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/bookstore
   ```

3. Restart MongoDB:
   ```bash
   brew services restart mongodb-community  # macOS
   sudo systemctl restart mongod            # Linux
   ```

### Port Already in Use
**Problem**: Port 5000 or 3000 is already in use

**Solutions**:
1. Change the port in `.env` (backend) or `client/package.json` (frontend)
2. Kill the process using the port:
   ```bash
   # Find process on port 5000
   lsof -ti:5000 | xargs kill -9  # macOS/Linux
   
   # On Windows:
   netstat -ano | findstr :5000
   taskkill /PID {process_id} /F
   ```

### Cannot Login
**Problem**: Invalid credentials

**Solutions**:
1. Make sure you've run the seed script: `npm run seed`
2. Use the correct credentials:
   - Admin: `admin@bookstore.com` / `admin123`
   - User: `user@bookstore.com` / `user123`
3. Register a new account through the UI

### CORS Error
**Problem**: CORS policy blocking requests

**Solution**: 
The backend already has CORS enabled. Make sure:
1. Backend is running on port 5000
2. Frontend proxy is configured in `client/package.json`:
   ```json
   "proxy": "http://localhost:5000"
   ```

### Module Not Found Error
**Problem**: Cannot find module errors

**Solution**:
```bash
# Delete node_modules and reinstall
rm -rf node_modules client/node_modules
npm run install-all
```

## Next Steps

1. **Customize the application**:
   - Update branding and colors in CSS files
   - Add more book categories
   - Implement additional features

2. **Deploy to production**:
   - Set up production database (MongoDB Atlas)
   - Deploy backend (Heroku, Railway, etc.)
   - Deploy frontend (Vercel, Netlify, etc.)

3. **Add more features**:
   - Email notifications
   - Payment gateway integration
   - Book recommendations
   - Wishlist functionality
   - Advanced search filters

## Support

If you encounter any issues:
1. Check the console for error messages
2. Review the API responses in the Network tab
3. Verify MongoDB is running and accessible
4. Check that all dependencies are installed

## Project Structure Reference

```
bookstore-management-system/
├── backend/              # Backend server code
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   └── server.js        # Server entry point
├── client/              # React frontend
│   ├── public/          # Static files
│   └── src/            # React components
├── seed.js             # Database seeding script
├── .env                # Environment variables
├── package.json        # Backend dependencies
└── README.md           # Documentation
```

Happy coding! 🚀📚
