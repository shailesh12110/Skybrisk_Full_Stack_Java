# CRM System - Full Stack Application

A complete Customer Relationship Management (CRM) system built with Spring Boot (backend) and React (frontend).

## Project Overview

This CRM system helps businesses manage their customer relationships, track leads, assign tasks, and monitor sales pipelines. It features role-based access control, JWT authentication, and a modern, responsive user interface.

## Features

- **User Management**: Registration, login, and role-based access (Admin/Sales)
- **Customer Management**: Full CRUD operations for customer records
- **Lead Tracking**: Manage leads with status tracking (New, Contacted, Converted, Lost)
- **Task Management**: Create, assign, and track tasks with priorities
- **Sales Pipeline**: Monitor sales opportunities and deal statuses
- **Dashboard**: Real-time statistics and overview
- **API Documentation**: Swagger/OpenAPI documentation
- **Security**: JWT-based authentication with Spring Security

## Tech Stack

### Backend
- Java 17
- Spring Boot 3.2.0
- Spring Data JPA
- Spring Security
- MySQL 8.0
- JWT (JSON Web Tokens)
- Swagger/OpenAPI
- Maven

### Frontend
- React 18
- React Router DOM
- Axios
- Vite
- CSS3

## Project Structure

```
crm-system/
├── crm-backend/          # Spring Boot backend
│   ├── src/
│   │   └── main/
│   │       ├── java/com/crm/
│   │       │   ├── controller/
│   │       │   ├── service/
│   │       │   ├── repository/
│   │       │   ├── model/
│   │       │   ├── dto/
│   │       │   ├── security/
│   │       │   └── exception/
│   │       └── resources/
│   │           └── application.properties
│   ├── pom.xml
│   └── README.md
│
└── crm-frontend/         # React frontend
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   ├── utils/
    │   └── App.jsx
    ├── package.json
    └── README.md
```

## Prerequisites

- Java 17 or higher
- Node.js 16+ and npm
- MySQL 8.0+
- Maven 3.6+

## Installation & Setup

### 1. Database Setup

Create a MySQL database:
```sql
CREATE DATABASE crm_db;
```

### 2. Backend Setup

Navigate to the backend directory:
```bash
cd crm-backend
```

Update database credentials in `src/main/resources/application.properties`:
```properties
spring.datasource.username=your_username
spring.datasource.password=your_password
```

Build and run:
```bash
mvn clean install
mvn spring-boot:run
```

Backend will start on `http://localhost:8080`

### 3. Frontend Setup

Navigate to the frontend directory:
```bash
cd crm-frontend
```

Install dependencies:
```bash
npm install
```

Run the development server:
```bash
npm run dev
```

Frontend will start on `http://localhost:3000`

## Usage

1. **Access the Application**: Open your browser and go to `http://localhost:3000`

2. **Register**: Create a new account (choose Admin or Sales role)

3. **Login**: Use your credentials to log in

4. **Explore Features**:
   - View dashboard statistics
   - Manage customers
   - Track leads
   - Create and assign tasks
   - Monitor sales pipeline

## API Documentation

Once the backend is running, access the Swagger UI at:
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **API Docs**: http://localhost:8080/api-docs

## API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - User login
- `GET /api/users/me` - Get current user

### Customers
- `GET /api/customers` - Get all customers
- `POST /api/customers` - Create customer
- `PUT /api/customers/{id}` - Update customer
- `DELETE /api/customers/{id}` - Delete customer

### Leads
- `GET /api/leads` - Get all leads
- `POST /api/leads` - Create lead
- `PUT /api/leads/{id}` - Update lead
- `GET /api/leads/status/{status}` - Filter by status

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/{id}` - Update task
- `GET /api/tasks/user/{userId}` - Get user tasks

### Sales
- `GET /api/sales` - Get all sales
- `POST /api/sales` - Create sale
- `PUT /api/sales/{id}` - Update sale
- `GET /api/sales/status/{status}` - Filter by status

## User Roles & Permissions

### Admin
- Full access to all features
- Can delete all resources
- Manage all users' data

### Sales Rep
- Create and edit customers, leads, tasks, and sales
- Limited delete permissions
- View all data

## Security

- JWT token-based authentication
- Passwords encrypted with BCrypt
- Role-based access control
- CORS configured for frontend origin
- Secure HTTP headers

## Development

### Running Tests

Backend:
```bash
cd crm-backend
mvn test
```

### Building for Production

Backend:
```bash
mvn clean package
```

Frontend:
```bash
npm run build
```

## Deployment

### Backend
Deploy the generated JAR file:
```bash
java -jar target/crm-backend-1.0.0.jar
```

### Frontend
Deploy the `dist` folder to a static hosting service (Netlify, Vercel, etc.)

## Troubleshooting

### Backend Issues
- Check MySQL is running and database exists
- Verify application.properties configuration
- Check port 8080 is available
- Review logs for errors

### Frontend Issues
- Ensure backend is running first
- Clear browser localStorage
- Check API base URL in api.js
- Verify CORS configuration

### Connection Issues
- Backend and frontend must run simultaneously
- Frontend proxies API calls to backend
- Check firewall settings

## Future Enhancements

- Email notifications
- Export reports (PDF, CSV)
- Dashboard charts and analytics
- Dark mode
- Real-time updates with WebSockets
- File attachments
- Advanced search and filtering
- Mobile app

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Check the documentation
- Review API documentation in Swagger
- Check application logs
- Review backend console output

## Authors

CRM System - Full Stack Development Project

## Acknowledgments

- Spring Boot Documentation
- React Documentation
- JWT.io for token information
- Swagger for API documentation
