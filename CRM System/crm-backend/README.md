# CRM Backend - Spring Boot Application

A complete CRM (Customer Relationship Management) backend system built with Spring Boot, MySQL, and JWT authentication.

## Features

- **User Authentication**: JWT-based authentication with role-based access control (Admin/Sales)
- **Customer Management**: Full CRUD operations for managing customers
- **Lead Management**: Track and manage leads with different statuses
- **Task Management**: Create and assign tasks to team members
- **Sales Pipeline**: Manage sales opportunities and deals
- **API Documentation**: Swagger/OpenAPI documentation
- **Security**: Spring Security with JWT tokens

## Technologies

- Java 17
- Spring Boot 3.2.0
- Spring Data JPA
- Spring Security
- MySQL 8.0
- JWT (io.jsonwebtoken)
- Lombok
- Swagger/OpenAPI 3.0

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+

## Database Setup

1. Install MySQL and start the service
2. Create a database (it will auto-create if configured):
```sql
CREATE DATABASE crm_db;
```

3. Update database credentials in `src/main/resources/application.properties`:
```properties
spring.datasource.username=root
spring.datasource.password=your_password
```

## Running the Application

1. Clone the repository and navigate to the backend folder
2. Build the project:
```bash
mvn clean install
```

3. Run the application:
```bash
mvn spring-boot:run
```

The server will start on `http://localhost:8080`

## API Documentation

Once the application is running, access the Swagger UI at:
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **API Docs**: http://localhost:8080/api-docs

## API Endpoints

### Authentication
- `POST /api/register` - Register a new user
- `POST /api/login` - Login and get JWT token
- `GET /api/users/me` - Get current user profile

### Customers
- `GET /api/customers` - Get all customers
- `GET /api/customers/{id}` - Get customer by ID
- `POST /api/customers` - Create new customer
- `PUT /api/customers/{id}` - Update customer
- `DELETE /api/customers/{id}` - Delete customer (Admin only)

### Leads
- `GET /api/leads` - Get all leads
- `GET /api/leads/{id}` - Get lead by ID
- `POST /api/leads` - Create new lead
- `PUT /api/leads/{id}` - Update lead
- `DELETE /api/leads/{id}` - Delete lead (Admin only)
- `GET /api/leads/status/{status}` - Get leads by status

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/{id}` - Get task by ID
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task
- `GET /api/tasks/user/{userId}` - Get tasks by user

### Sales
- `GET /api/sales` - Get all sales
- `GET /api/sales/{id}` - Get sale by ID
- `POST /api/sales` - Create new sale
- `PUT /api/sales/{id}` - Update sale
- `DELETE /api/sales/{id}` - Delete sale (Admin only)
- `GET /api/sales/customer/{customerId}` - Get sales by customer
- `GET /api/sales/status/{status}` - Get sales by status

## Authentication

All API endpoints (except `/api/register` and `/api/login`) require authentication.

Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## User Roles

- **ADMIN**: Full access to all resources
- **SALES**: Can create/update customers, leads, tasks, and sales; cannot delete

## Testing with Postman

1. Register a new user at `/api/register`
2. Login at `/api/login` to get JWT token
3. Use the token in Authorization header for subsequent requests

## Project Structure

```
crm-backend/
├── src/main/java/com/crm/
│   ├── controller/      # REST Controllers
│   ├── service/         # Business Logic
│   ├── repository/      # Data Access Layer
│   ├── model/           # Entity Models
│   ├── dto/             # Data Transfer Objects
│   ├── security/        # JWT & Security Config
│   └── exception/       # Exception Handlers
├── src/main/resources/
│   └── application.properties
└── pom.xml
```

## Database Schema

The application uses the following main entities:
- **users**: User accounts with roles
- **customers**: Customer information
- **leads**: Sales leads
- **tasks**: Task assignments
- **sales**: Sales transactions

Relationships are automatically managed by JPA/Hibernate.

## Development

To run in development mode with auto-reload:
```bash
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5005"
```

## License

This project is licensed under the MIT License.
