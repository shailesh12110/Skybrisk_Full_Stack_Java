# Bookstore API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer {token}
```

---

## Auth Endpoints

### Register User
**POST** `/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  }
}
```

**Response:**
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "token": "jwt_token_here"
}
```

### Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "token": "jwt_token_here"
}
```

---

## Book Endpoints

### Get All Books
**GET** `/books`

**Query Parameters:**
- `category` (optional): Filter by category
- `author` (optional): Filter by author name
- `search` (optional): Search in title, author, or description
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `sort` (optional): Sort field (default: -createdAt)

**Example:**
```
GET /books?category=Fiction&page=1&limit=10
GET /books?search=gatsby
```

**Response:**
```json
{
  "books": [...],
  "totalPages": 5,
  "currentPage": "1",
  "total": 50
}
```

### Get Single Book
**GET** `/books/:id`

**Response:**
```json
{
  "_id": "book_id",
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "isbn": "978-0743273565",
  "description": "...",
  "price": 12.99,
  "category": "Fiction",
  "publisher": "Scribner",
  "publishedDate": "1925-04-10T00:00:00.000Z",
  "language": "English",
  "pages": 180,
  "stock": 50,
  "coverImage": "image_url",
  "rating": 4.5,
  "reviews": [...]
}
```

### Create Book (Admin Only)
**POST** `/books`

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Request Body:**
```json
{
  "title": "New Book",
  "author": "Author Name",
  "isbn": "978-1234567890",
  "description": "Book description here",
  "price": 19.99,
  "category": "Fiction",
  "publisher": "Publisher Name",
  "language": "English",
  "pages": 300,
  "stock": 100,
  "coverImage": "image_url"
}
```

**Response:**
```json
{
  "_id": "new_book_id",
  "title": "New Book",
  ...
}
```

### Update Book (Admin Only)
**PUT** `/books/:id`

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Request Body:** (same as Create Book)

### Delete Book (Admin Only)
**DELETE** `/books/:id`

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Response:**
```json
{
  "message": "Book removed successfully"
}
```

### Add Book Review
**POST** `/books/:id/reviews`

**Headers:**
```
Authorization: Bearer {user_token}
```

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Great book! Highly recommended."
}
```

**Response:**
```json
{
  "message": "Review added successfully"
}
```

---

## Order Endpoints

### Get Orders
**GET** `/orders`

**Headers:**
```
Authorization: Bearer {user_token}
```

**Description:**
- Users get their own orders
- Admins get all orders

**Response:**
```json
[
  {
    "_id": "order_id",
    "user": {...},
    "items": [
      {
        "book": {...},
        "quantity": 2,
        "price": 12.99
      }
    ],
    "totalAmount": 25.98,
    "status": "Pending",
    "shippingAddress": {...},
    "paymentMethod": "Cash on Delivery",
    "paymentStatus": "Pending",
    "orderDate": "2024-02-24T12:00:00.000Z"
  }
]
```

### Get Single Order
**GET** `/orders/:id`

**Headers:**
```
Authorization: Bearer {user_token}
```

**Response:**
```json
{
  "_id": "order_id",
  "user": {...},
  "items": [...],
  "totalAmount": 25.98,
  ...
}
```

### Create Order
**POST** `/orders`

**Headers:**
```
Authorization: Bearer {user_token}
```

**Request Body:**
```json
{
  "items": [
    {
      "book": "book_id_1",
      "quantity": 2
    },
    {
      "book": "book_id_2",
      "quantity": 1
    }
  ],
  "shippingAddress": {
    "name": "John Doe",
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA",
    "phone": "1234567890"
  },
  "paymentMethod": "Cash on Delivery"
}
```

**Response:**
```json
{
  "_id": "order_id",
  "items": [...],
  "totalAmount": 45.97,
  ...
}
```

### Update Order Status (Admin Only)
**PUT** `/orders/:id/status`

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Request Body:**
```json
{
  "status": "Shipped"
}
```

**Valid Status Values:**
- Pending
- Processing
- Shipped
- Delivered
- Cancelled

**Response:**
```json
{
  "_id": "order_id",
  "status": "Shipped",
  ...
}
```

### Cancel Order
**DELETE** `/orders/:id`

**Headers:**
```
Authorization: Bearer {user_token}
```

**Description:**
- Users can cancel their own pending/processing orders
- Admins can cancel any order
- Stock is restored when order is cancelled

**Response:**
```json
{
  "message": "Order cancelled successfully"
}
```

---

## User Endpoints

### Get All Users (Admin Only)
**GET** `/users`

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Response:**
```json
[
  {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "phone": "1234567890",
    "address": {...},
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Get User Profile
**GET** `/users/profile`

**Headers:**
```
Authorization: Bearer {user_token}
```

**Response:**
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "phone": "1234567890",
  "address": {...}
}
```

### Update User Profile
**PUT** `/users/profile`

**Headers:**
```
Authorization: Bearer {user_token}
```

**Request Body:**
```json
{
  "name": "John Doe Updated",
  "email": "john.new@example.com",
  "phone": "9876543210",
  "address": {
    "street": "456 New St",
    "city": "Los Angeles",
    "state": "CA",
    "zipCode": "90001",
    "country": "USA"
  },
  "password": "newpassword123"
}
```

**Note:** All fields are optional. Password field is only needed if changing password.

**Response:**
```json
{
  "_id": "user_id",
  "name": "John Doe Updated",
  "email": "john.new@example.com",
  ...
}
```

### Delete User (Admin Only)
**DELETE** `/users/:id`

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Response:**
```json
{
  "message": "User removed successfully"
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "message": "Error message here",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "message": "Not authorized to access this route"
}
```

### 403 Forbidden
```json
{
  "message": "User role 'user' is not authorized to access this route"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Server Error
```json
{
  "message": "Server error",
  "error": "Error details (only in development)"
}
```

---

## Testing with cURL

### Example: Complete User Flow

1. **Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "test123"
  }'
```

2. **Login and save token:**
```bash
TOKEN=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }' | jq -r '.token')
```

3. **Get books:**
```bash
curl http://localhost:5000/api/books
```

4. **Create order:**
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "items": [
      {
        "book": "BOOK_ID_HERE",
        "quantity": 1
      }
    ],
    "shippingAddress": {
      "name": "Test User",
      "street": "123 Test St",
      "city": "Test City",
      "state": "TS",
      "zipCode": "12345",
      "country": "USA",
      "phone": "1234567890"
    },
    "paymentMethod": "Cash on Delivery"
  }'
```

5. **View orders:**
```bash
curl http://localhost:5000/api/orders \
  -H "Authorization: Bearer $TOKEN"
```

---

## Rate Limiting

Currently, there is no rate limiting implemented. For production, consider adding:
- Rate limiting middleware (express-rate-limit)
- Request throttling
- IP-based restrictions

## Security Notes

1. **Always use HTTPS in production**
2. **Change JWT_SECRET** to a strong random value
3. **Enable CORS** only for trusted origins in production
4. **Implement rate limiting** to prevent abuse
5. **Validate all inputs** on both client and server
6. **Use strong passwords** and consider implementing password policies
7. **Regularly update dependencies** to patch security vulnerabilities

---

For more details, see [README.md](README.md) and [SETUP.md](SETUP.md)
