# HRMS - Human Resource Management System

## 🎯 Project Overview

This HRMS application provides a complete employee management system with the following capabilities:

- **Employee Management**: Create, read, update, and manage employee records
- **Department Organization**: Organize employees by departments and positions
- **Manager Hierarchy**: Track reporting relationships between employees
- **Status Management**: Handle active/inactive employee statuses
- **Data Validation**: Comprehensive validation for all employee data

### 🏗️ Architecture

- **Backend**: Node.js with Express.js framework
- **Database**: MongoDB with Mongoose ODM
- **Frontend**: *In Development* (React planned)
- **API**: RESTful API design with JSON responses

## 🎓 Learning Objectives

This project is designed to help students learn:

- RESTful API development with Express.js
- MongoDB database design and operations
- Data validation and error handling
- Employee management system concepts
- Full-stack application architecture
- Git version control and collaboration

## 📋 Prerequisites

Before running this project, ensure you have:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download here](https://www.mongodb.com/try/download/community)
- **Git** - [Download here](https://git-scm.com/)
- **Code Editor** (VS Code recommended)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/v-eenay/hrms-ennrichment.git
cd hrms-ennrichment
```

### 2. Backend Setup

```bash
cd backend
npm install
```

### 3. Environment Configuration

Create a `.env` file in the backend directory:

```env
PORT=5000
DB_URL=mongodb://localhost:27017/hrms_db
```

### 4. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# On Windows (if installed as service)
net start MongoDB

# On macOS (with Homebrew)
brew services start mongodb-community

# On Linux
sudo systemctl start mongod
```

### 5. Run the Application

```bash
# In the backend directory
npm run dev
```

The API will be available at `http://localhost:5000`

## 📚 API Documentation

### Base URL

```
http://localhost:5000
```

### Endpoints

#### 1. Create Employee

```http
POST /employees
Content-Type: application/json

{
  "employeeId": "EMP001",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@company.com",
  "phone": "+1-555-0123",
  "department": "Engineering",
  "position": "Software Developer",
  "hireDate": "2024-01-15",
  "salary": 75000,
  "status": "active"
}
```

#### 2. Get All Employees

```http
GET /employees
```

**With Filtering:**

```http
GET /employees?department=Engineering&status=active
```

#### 3. Get Employee by ID

```http
GET /employees/:id
```

#### 4. Update Employee

```http
PUT /employees/:id
Content-Type: application/json

{
  "employeeId": "EMP001",
  "firstName": "John",
  "lastName": "Smith",
  "email": "john.smith@company.com",
  "phone": "+1-555-0123",
  "department": "Engineering",
  "position": "Senior Software Developer",
  "hireDate": "2024-01-15",
  "salary": 85000,
  "status": "active"
}
```

#### 5. Deactivate Employee

```http
DELETE /employees/:id
```

### Sample Response

```json
{
  "message": "Employee retrieved successfully",
  "employee": {
    "_id": "674a1b2c3d4e5f6789012345",
    "employeeId": "EMP001",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@company.com",
    "phone": "+1-555-0123",
    "department": "Engineering",
    "position": "Software Developer",
    "hireDate": "2024-01-15T00:00:00.000Z",
    "salary": 75000,
    "status": "active",
    "manager": null,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

## 📁 Project Structure

```
hrms-enrichment/
├── README.md                 # Main project documentation
├── backend/                  # Backend API server
│   ├── src/
│   │   ├── config/          # Database and environment configuration
│   │   ├── models/          # MongoDB schemas (Employee model)
│   │   ├── routes/          # API route handlers
│   │   ├── controllers/     # Business logic (future expansion)
│   │   ├── middleware/      # Custom middleware (future expansion)
│   │   ├── services/        # Business services (future expansion)
│   │   └── utils/           # Utility functions (future expansion)
│   ├── sample-data/         # Sample employee data for testing
│   ├── package.json         # Backend dependencies
│   └── README.md           # Backend-specific documentation
├── frontend/                # Frontend application (in development)
│   └── README.md           # Frontend-specific documentation
└── .gitignore              # Git ignore rules
```

## 🧪 Testing with Sample Data

The project includes sample employee data for testing:

1. **Import Sample Data** (optional):

```bash
# Navigate to backend directory
cd backend

# Import sample employees into MongoDB
mongoimport --db hrms_db --collection employees --file sample-data/employees.json --jsonArray
```

2. **Test API Endpoints**:

```bash
# Get all employees
curl http://localhost:5000/employees

# Get employees by department
curl "http://localhost:5000/employees?department=Engineering"

# Get specific employee
curl http://localhost:5000/employees/674a1b2c3d4e5f6789012345
```

## 🎯 Employee Model Schema

Each employee record contains:

- **employeeId**: Unique identifier (required)
- **firstName**: Employee's first name (required)
- **lastName**: Employee's last name (required)
- **email**: Email address (required, unique, validated)
- **phone**: Phone number (optional, validated format)
- **department**: Department name (required)
- **position**: Job title/position (required)
- **hireDate**: Date of hire (required, cannot be future)
- **salary**: Annual salary (required, positive number)
- **status**: Employment status (active/inactive)
- **manager**: Reference to another employee (optional)

## 🔧 Development Workflow

### Available Scripts (Backend)

```bash
npm start        # Start production server
npm run dev      # Start development server with nodemon
npm test         # Run tests (to be implemented)
```

### Development Tips

1. Use `npm run dev` for development (auto-restart on changes)
2. Check MongoDB connection in console logs
3. Use Postman or curl for API testing
4. Monitor console for error messages

## 🚧 Frontend Development

The frontend is currently **under development**. Planned features include:

- Employee dashboard and management interface
- Department and hierarchy visualization
- Employee search and filtering
- Responsive design for mobile and desktop

**Planned Technology Stack:**

- React.js with Vite
- Tailwind CSS for styling
- React Router for navigation
- Context API or Redux Toolkit for state management
- Axios for HTTP requests

## 🐛 Troubleshooting

### Common Issues

**1. MongoDB Connection Error**

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution**: Ensure MongoDB is running on your system.

**2. Port Already in Use**

```
Error: listen EADDRINUSE :::5000
```

**Solution**: Change the PORT in your `.env` file or stop the process using port 5000.

**3. Validation Errors**

```
ValidationError: Path `email` is required
```

**Solution**: Ensure all required fields are included in your request body.

## 🤝 Contributing

This project is designed for educational purposes. Students are encouraged to:

- Fork the repository and experiment
- Add new features and improvements
- Practice Git workflows
- Submit pull requests with enhancements

## 📄 License

**No License Restrictions** - This project is created for educational purposes. Students are free to:

- Clone and fork the repository
- Modify the code for learning
- Use it as a foundation for their own projects
- Share and distribute modifications

## 📚 Tutorials & Learning Resources

This project includes comprehensive tutorials to help you understand the backend implementation:

### **Core Tutorials**
1. **[Architecture & Design Patterns](tutorials/architecture.md)** - Understanding the project structure and design decisions
2. **[Employee Model Deep Dive](tutorials/employee-model.md)** - Mongoose schemas, validation, and relationships
3. **[API Routes & HTTP Operations](tutorials/api-routes.md)** - RESTful API implementation and Express.js routing
4. **[Database Operations & MongoDB](tutorials/database-operations.md)** - CRUD operations, queries, and optimization

### **Learning Progression**
For the best learning experience, follow this order:
1. Start with **Architecture** to understand the overall structure
2. Study the **Employee Model** to learn data modeling concepts
3. Explore **API Routes** to understand request/response handling
4. Deep dive into **Database Operations** for advanced MongoDB concepts

### **Practical Exercises**
Each tutorial includes:
- Step-by-step code explanations
- Practical examples and use cases
- Best practices and common pitfalls
- Hands-on exercises to reinforce learning
- Performance optimization techniques

## 🎓 Next Steps for Students

1. **Follow the Tutorials**: Work through the tutorials in the recommended order
2. **Explore the Code**: Study the Employee model and API routes implementation
3. **Practice with Sample Data**: Use the provided sample data to test operations
4. **Add Features**: Implement additional endpoints or validation rules
5. **Build Frontend**: Create a user interface for the API (React + Tailwind planned)
6. **Add Authentication**: Implement user login and authorization
7. **Deploy**: Learn to deploy the application to cloud platforms
8. **Testing**: Write unit and integration tests

## 📖 Quick Reference

### **Project Structure**
```
hrms-ennrichment/
├── tutorials/           # Learning tutorials and guides
├── backend/            # Node.js/Express API server
│   ├── src/           # Source code
│   └── sample-data/   # Sample employee data
├── frontend/          # React frontend (in development)
└── README.md          # This file
```

### **Key Files to Study**
- `backend/src/models/employeeModel.js` - Data model and validation
- `backend/src/routes/employeeRoutes.js` - API endpoints
- `backend/src/config/db.js` - Database connection
- `backend/sample-data/employees.json` - Sample data for testing

## 📞 Support

For questions or issues:

1. **Start with Tutorials**: Check the comprehensive tutorials in the `tutorials/` directory
2. **Review Documentation**: Check the backend README for detailed setup instructions
3. **Examine Sample Data**: Use the provided sample data to understand the data structure
4. **Practice with API**: Test different endpoints using Postman or curl
5. **Study the Code**: Follow the tutorials while examining the actual implementation

Happy coding! 🚀
