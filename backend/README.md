# HRMS Backend API

The backend API server for the Human Resource Management System, built with Node.js, Express.js, and MongoDB.

## 🏗️ Technology Stack

- **Runtime**: Node.js (v16+)
- **Framework**: Express.js (v5.1.0)
- **Database**: MongoDB with Mongoose ODM (v8.16.1)
- **Additional Libraries**:
  - CORS for cross-origin requests
  - dotenv for environment variables
  - nodemon for development auto-restart

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=5000

# Database Configuration
DB_URL=mongodb://localhost:27017/hrms_db

# Optional: Add these for production
NODE_ENV=development
```

### 3. MongoDB Setup

**Option A: Local MongoDB Installation**

1. Install MongoDB Community Edition
2. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB

   # macOS (Homebrew)
   brew services start mongodb-community

   # Linux
   sudo systemctl start mongod
   ```

**Option B: MongoDB Atlas (Cloud)**

1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a cluster and get connection string
3. Update `DB_URL` in `.env`:
   ```env
   DB_URL=mongodb+srv://username:password@cluster.mongodb.net/hrms_db
   ```

### 4. Start the Server

**Development Mode** (recommended):

```bash
npm run dev
```

**Production Mode**:

```bash
npm start
```

The server will start at `http://localhost:5000`

## 📊 Employee Model Schema

```javascript
{
  employeeId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
  },
  phone: {
    type: String,
    trim: true,
    match: /^[\+]?[1-9][\d]{0,15}$/
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  position: {
    type: String,
    required: true,
    trim: true
  },
  hireDate: {
    type: Date,
    required: true,
    validate: {
      validator: function(value) {
        return value <= new Date();
      },
      message: 'Hire date cannot be in the future'
    }
  },
  salary: {
    type: Number,
    required: true,
    min: [0, 'Salary must be a positive number']
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    default: null
  }
}
```

## 🛠️ API Endpoints

### Base URL: `http://localhost:5000`

### 1. Create Employee

```bash
curl -X POST http://localhost:5000/employees \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "EMP009",
    "firstName": "Alice",
    "lastName": "Johnson",
    "email": "alice.johnson@company.com",
    "phone": "+1-555-0199",
    "department": "Marketing",
    "position": "Marketing Specialist",
    "hireDate": "2024-01-15",
    "salary": 60000,
    "status": "active"
  }'
```

### 2. Get All Employees

```bash
# Get all employees
curl http://localhost:5000/employees

# Filter by department
curl "http://localhost:5000/employees?department=Engineering"

# Filter by status
curl "http://localhost:5000/employees?status=active"

# Multiple filters
curl "http://localhost:5000/employees?department=HR&status=active"
```

### 3. Get Employee by ID

```bash
curl http://localhost:5000/employees/674a1b2c3d4e5f6789012345
```

### 4. Update Employee

```bash
curl -X PUT http://localhost:5000/employees/674a1b2c3d4e5f6789012345 \
  -H "Content-Type: application/json" \
  -d '{
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
  }'
```

### 5. Deactivate Employee (Soft Delete)

```bash
curl -X DELETE http://localhost:5000/employees/674a1b2c3d4e5f6789012345
```

## 📁 Sample Data Usage

### Import Sample Employees

The project includes sample employee data in `sample-data/employees.json`:

```bash
# Make sure MongoDB is running
# Navigate to backend directory
cd backend

# Import sample data
mongoimport --db hrms_db --collection employees --file sample-data/employees.json --jsonArray
```

### Sample Data Overview

- 8 employees across 4 departments
- Demonstrates manager-employee relationships
- Includes both active and inactive employees
- Shows realistic salary ranges and positions

## 🔧 Development Workflow

### Available Scripts

```bash
npm start        # Start production server
npm run dev      # Start development server with auto-restart
npm test         # Run tests (to be implemented)
```

### Development Tips

1. **Use Development Mode**: `npm run dev` automatically restarts on file changes
2. **Monitor Logs**: Check console for database connection status and errors
3. **Test with Postman**: Import API endpoints for easier testing
4. **Database GUI**: Use MongoDB Compass for visual database management

### Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── config.js        # Environment variables
│   │   └── db.js           # Database connection
│   ├── models/
│   │   └── employeeModel.js # Employee schema
│   ├── routes/
│   │   └── employeeRoutes.js # API endpoints
│   ├── controllers/         # Future: Business logic
│   ├── middleware/          # Future: Custom middleware
│   ├── services/           # Future: Business services
│   └── utils/              # Future: Utility functions
├── sample-data/
│   └── employees.json      # Sample employee data
├── package.json
└── README.md
```

## 🧪 Testing the API

### Manual Testing with curl

**Test Employee Creation:**

```bash
curl -X POST http://localhost:5000/employees \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "TEST001",
    "firstName": "Test",
    "lastName": "User",
    "email": "test.user@company.com",
    "department": "IT",
    "position": "Test Engineer",
    "hireDate": "2024-01-01",
    "salary": 70000
  }'
```

**Test Data Validation:**

```bash
# This should fail - missing required fields
curl -X POST http://localhost:5000/employees \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Incomplete",
    "lastName": "Data"
  }'
```

### Using Postman

1. Import the following collection:

   - Base URL: `http://localhost:5000`
   - Create requests for each endpoint
   - Set up environment variables for testing
2. Test scenarios:

   - Valid employee creation
   - Invalid data validation
   - Employee retrieval and filtering
   - Employee updates
   - Employee deactivation

## 🐛 Troubleshooting

### Common Issues

**1. Database Connection Failed**

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solutions:**

- Ensure MongoDB is running: `brew services start mongodb-community`
- Check if port 27017 is available
- Verify `DB_URL` in `.env` file

**2. Port Already in Use**

```
Error: listen EADDRINUSE :::5000
```

**Solutions:**

- Change `PORT` in `.env` file
- Kill process using port 5000: `lsof -ti:5000 | xargs kill -9`

**3. Validation Errors**

```
ValidationError: Path `email` is required
```

**Solutions:**

- Check request body includes all required fields
- Verify email format matches regex pattern
- Ensure salary is a positive number

**4. Duplicate Key Error**

```
E11000 duplicate key error
```

**Solutions:**

- Use unique `employeeId` and `email` values
- Check existing employees before creating new ones

### Debug Mode

Enable detailed logging by setting:

```env
NODE_ENV=development
```

### Database Inspection

**Using MongoDB Compass:**

1. Connect to `mongodb://localhost:27017`
2. Navigate to `hrms_db` database
3. View `employees` collection

**Using MongoDB Shell:**

```bash
mongo
use hrms_db
db.employees.find().pretty()
```

## 🔒 Security Considerations

### Current Implementation

- Basic input validation
- Email format validation
- Data sanitization with Mongoose

### Future Enhancements

- Authentication and authorization
- Rate limiting
- Input sanitization middleware
- HTTPS enforcement
- Environment-specific configurations

## 📈 Performance Optimization

### Database Indexes

The Employee model includes indexes on:

- `employeeId` (unique)
- `email` (unique)
- `department`
- `status`

### Future Optimizations

- Pagination for large datasets
- Caching frequently accessed data
- Database query optimization
- API response compression

## 🚀 Deployment

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
DB_URL=mongodb+srv://username:password@cluster.mongodb.net/hrms_db
```

### Deployment Platforms

- **Heroku**: Easy deployment with MongoDB Atlas
- **Railway**: Modern deployment platform
- **DigitalOcean**: VPS deployment
- **AWS/Azure**: Enterprise-level deployment

## 🔄 Future Enhancements

### Planned Features

1. **Authentication System**

   - User registration and login
   - JWT token-based authentication
   - Role-based access control
2. **Advanced Employee Management**

   - Employee photo uploads
   - Document management
   - Performance reviews
   - Leave management
3. **Reporting and Analytics**

   - Department statistics
   - Salary analytics
   - Employee growth tracking
4. **API Improvements**

   - Pagination
   - Advanced filtering
   - Bulk operations
   - API versioning

## 📚 Learning Resources

### Recommended Reading

- [Express.js Documentation			](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [MongoDB Manual](https://docs.mongodb.com/)
- [RESTful API Design](https://restfulapi.net/)

### Practice Exercises

1. Add new employee fields (address, emergency contact)
2. Implement employee search functionality
3. Create department management endpoints
4. Add data export functionality
5. Implement employee photo upload

Happy coding! 🎉
