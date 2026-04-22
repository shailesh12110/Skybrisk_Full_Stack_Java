# CRM Frontend - React Application

A modern, responsive CRM (Customer Relationship Management) frontend built with React and Vite.

## Features

- **User Authentication**: Login and registration with JWT token management
- **Dashboard**: Overview of key metrics (customers, leads, tasks, sales)
- **Customer Management**: Add, edit, view, and delete customers
- **Lead Management**: Track leads with status updates
- **Task Management**: Create and manage tasks with priorities
- **Sales Pipeline**: Manage sales opportunities and track deals
- **Role-Based Access**: Different views for Admin and Sales roles
- **Responsive Design**: Works on desktop and mobile devices

## Technologies

- React 18
- React Router DOM 6
- Axios for API calls
- Vite for fast development
- CSS3 for styling

## Prerequisites

- Node.js 16+ and npm

## Installation

1. Navigate to the frontend directory:
```bash
cd crm-frontend
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Building for Production

Build the application:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
crm-frontend/
├── src/
│   ├── components/      # Reusable components
│   │   ├── Navbar.jsx
│   │   └── PrivateRoute.jsx
│   ├── pages/           # Page components
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Customers.jsx
│   │   ├── Leads.jsx
│   │   ├── Tasks.jsx
│   │   └── Sales.jsx
│   ├── services/        # API service layer
│   │   └── api.js
│   ├── utils/           # Utility functions
│   │   └── auth.js
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── index.html
├── package.json
└── vite.config.js
```

## Configuration

The application is configured to proxy API requests to the backend server running on `http://localhost:8080`.

This is configured in [vite.config.js](vite.config.js):
```javascript
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
    }
  }
}
```

## API Integration

The frontend communicates with the Spring Boot backend via REST APIs. All API calls are centralized in [src/services/api.js](src/services/api.js).

Authentication tokens are automatically attached to requests after login.

## Features by Page

### Login/Register
- User authentication
- Form validation
- Error handling
- Automatic redirect after login

### Dashboard
- Overview statistics
- Quick access to all modules

### Customers
- List all customers
- Add new customers
- Edit customer details
- Delete customers (Admin only)

### Leads
- Track leads with status
- Filter by status
- Assign to sales reps
- Convert leads

### Tasks
- Create and manage tasks
- Set priorities and due dates
- Update task status
- Assign to team members

### Sales
- Manage sales pipeline
- Track deal amounts
- Update sales status
- Link to customers

## User Roles

- **Admin**: Full access including delete operations
- **Sales**: Can create and edit, limited delete access

## Development

### Adding New Features

1. Create components in `src/components/` or `src/pages/`
2. Add API endpoints in `src/services/api.js`
3. Update routes in `src/App.jsx`
4. Add styles in `src/index.css`

### State Management

Currently using React hooks (useState, useEffect) for state management. For larger applications, consider integrating Redux or Context API.

## Troubleshooting

### Backend Connection Issues
- Ensure the backend server is running on port 8080
- Check CORS configuration in the backend
- Verify API endpoints match the backend routes

### Authentication Issues
- Clear browser localStorage
- Check JWT token expiration
- Verify token is being sent in Authorization header

## License

This project is licensed under the MIT License.
