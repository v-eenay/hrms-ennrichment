# HRMS Backend API

A comprehensive Human Resource Management System backend API built with Node.js, Express.js, and MongoDB. This project features a modern, modular architecture with authentication, authorization, and full CRUD operations for HR management.

## 🏗️ Technology Stack

- **Runtime**: Node.js (v16+)
- **Framework**: Express.js (v5.1.0)
- **Database**: MongoDB with Mongoose ODM (v8.16.1)
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs for password hashing
- **API Documentation**: Swagger/OpenAPI 3.0 with interactive UI
- **Additional Libraries**:
  - CORS for cross-origin requests
  - dotenv for environment variables
  - nodemon for development auto-restart
  - swagger-jsdoc & swagger-ui-express for API documentation

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin, HR, Manager, Employee)
- Secure password hashing with bcryptjs
- Protected routes and middleware

### 👥 User Management
- Complete user lifecycle management
- Role-based permissions
- User profile management
- Secure password updates

### 🏢 Department Management
- Department creation and management
- Department-user relationships
- Department-based reporting

### ⏰ Attendance System
- Clock in/out functionality
- Daily attendance tracking
- Attendance history and reports
- Overtime calculation

### 🏖️ Leave Management
- Leave request submission
- Leave approval workflow
- Leave balance tracking
- Leave type management

### 💰 Payroll System
- Salary calculation and processing
- Payroll history
- Automated payroll generation
- Salary slip generation

### 📊 Performance Management
- Performance review system
- Goal setting and tracking
- Performance ratings
- Review history

### 📚 Interactive API Documentation
- Swagger/OpenAPI 3.0 documentation
- Interactive API testing in browser
- Comprehensive endpoint documentation
- Real-time request/response testing
- Authentication testing workflow

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

Create a `.env` file in the backend directory using the provided template:

```bash
cp .env.example .env
```

Configure your environment variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_URL=mongodb://localhost:27017/hrms_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# Admin Configuration
ADMIN_EMAIL=admin@company.com
ADMIN_PASSWORD=Admin123!
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

### 5. Access API Documentation

Once the server is running, you can access the interactive API documentation at:

- **Swagger UI**: `http://localhost:5000/api-docs`
- **API Endpoints**: `http://localhost:5000/api/`
- **Health Check**: `http://localhost:5000/health`

The Swagger UI provides:
- ✅ Interactive API testing
- ✅ Complete endpoint documentation
- ✅ Request/response examples
- ✅ Authentication workflow testing
- ✅ Schema validation

## 🏗️ Project Architecture

### Modular Structure
```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   └── utils/           # Utility functions
├── tutorials/           # Learning resources
├── .env.example        # Environment template
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

### Design Patterns
- **MVC Architecture**: Separation of concerns
- **Service Layer**: Business logic abstraction
- **Middleware Pattern**: Request/response processing
- **Repository Pattern**: Data access abstraction

## 📊 Data Models

### 👤 User Model
```javascript
{
  employeeId: String,     // Unique identifier
  firstName: String,      // Required
  lastName: String,       // Required
  email: String,          // Required, unique
  password: String,       // Required, hashed
  phone: String,
  department: ObjectId,   // Reference to Department
  position: String,       // Required
  role: String,          // admin, hr, manager, employee
  hireDate: Date,        // Required
  salary: Number,        // Required
  status: String,        // active, inactive
  manager: ObjectId,     // Reference to User
  address: Object,       // Street, city, state, zip
  emergencyContact: Object, // Name, phone, relationship
  profileImage: String,  // URL to profile image
  isActive: Boolean,     // Account status
  lastLogin: Date,       // Last login timestamp
  createdAt: Date,       // Auto-generated
  updatedAt: Date        // Auto-generated
}
```

### 🏢 Department Model
```javascript
{
  name: String,          // Required, unique
  description: String,   // Optional
  manager: ObjectId,     // Reference to User
  budget: Number,        // Department budget
  location: String,      // Department location
  isActive: Boolean,     // Department status
  createdAt: Date,       // Auto-generated
  updatedAt: Date        // Auto-generated
}
```

### ⏰ Attendance Model
```javascript
{
  user: ObjectId,        // Reference to User
  date: Date,           // Required
  clockIn: Date,        // Clock in time
  clockOut: Date,       // Clock out time
  breakTime: Number,    // Break time in minutes
  totalHours: Number,   // Calculated total hours
  overtimeHours: Number, // Calculated overtime
  status: String,       // present, absent, late, holiday
  notes: String,        // Optional notes
  createdAt: Date,      // Auto-generated
  updatedAt: Date       // Auto-generated
}
```

### 🏖️ Leave Model
```javascript
{
  user: ObjectId,        // Reference to User
  type: String,         // annual, sick, personal, emergency
  startDate: Date,      // Required
  endDate: Date,        // Required
  days: Number,         // Calculated days
  reason: String,       // Required
  status: String,       // pending, approved, rejected
  approvedBy: ObjectId, // Reference to User
  appliedDate: Date,    // Auto-generated
  responseDate: Date,   // Approval/rejection date
  notes: String,        // Optional notes
  documents: [String],  // Document URLs
  createdAt: Date,      // Auto-generated
  updatedAt: Date       // Auto-generated
}
```

### 💰 Payroll Model
```javascript
{
  user: ObjectId,        // Reference to User
  month: Number,        // Required (1-12)
  year: Number,         // Required
  basicSalary: Number,  // Required
  allowances: Number,   // Additional allowances
  deductions: Number,   // Deductions
  overtime: Number,     // Overtime pay
  grossSalary: Number,  // Calculated gross
  tax: Number,          // Tax deductions
  netSalary: Number,    // Calculated net salary
  payDate: Date,        // Payment date
  status: String,       // pending, paid, cancelled
  payslipUrl: String,   // URL to payslip
  createdAt: Date,      // Auto-generated
  updatedAt: Date       // Auto-generated
}
```

### 📊 Performance Model
```javascript
{
  user: ObjectId,        // Reference to User
  reviewer: ObjectId,    // Reference to User
  period: String,        // Q1, Q2, Q3, Q4, Annual
  year: Number,         // Required
  goals: [Object],      // Performance goals
  achievements: [Object], // Achievements
  overallRating: Number, // 1-5 scale
  strengths: String,    // Strengths
  improvements: String, // Areas for improvement
  feedback: String,     // Reviewer feedback
  employeeFeedback: String, // Employee feedback
  status: String,       // draft, submitted, completed
  createdAt: Date,      // Auto-generated
  updatedAt: Date       // Auto-generated
}
```

## 🛠️ API Endpoints

### Base URL: `http://localhost:5000/api`

### 🔐 Authentication Routes

#### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "employeeId": "EMP001",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@company.com",
  "password": "SecurePass123!",
  "phone": "+1-555-0123",
  "department": "departmentId",
  "position": "Software Developer",
  "role": "employee",
  "hireDate": "2024-01-15",
  "salary": 75000
}
```

#### Login User
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john.doe@company.com",
  "password": "SecurePass123!"
}
```

#### Get Profile
```bash
GET /api/auth/profile
Authorization: Bearer <jwt-token>
```

### 👥 User Management Routes

#### Get All Users (Admin/HR only)
```bash
GET /api/users
Authorization: Bearer <jwt-token>
```

#### Get User by ID
```bash
GET /api/users/:id
Authorization: Bearer <jwt-token>
```

#### Update User
```bash
PUT /api/users/:id
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+1-555-0124",
  "position": "Senior Software Developer",
  "salary": 85000
}
```

#### Deactivate User
```bash
DELETE /api/users/:id
Authorization: Bearer <jwt-token>
```

### 🏢 Department Routes

#### Create Department
```bash
POST /api/departments
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "name": "Engineering",
  "description": "Software development team",
  "manager": "userId",
  "budget": 1000000,
  "location": "Building A, Floor 3"
}
```

#### Get All Departments
```bash
GET /api/departments
Authorization: Bearer <jwt-token>
```

### ⏰ Attendance Routes

#### Clock In
```bash
POST /api/attendance/clock-in
Authorization: Bearer <jwt-token>
```

#### Clock Out
```bash
POST /api/attendance/clock-out
Authorization: Bearer <jwt-token>
```

#### Get User Attendance
```bash
GET /api/attendance/user/:userId
Authorization: Bearer <jwt-token>
```

#### Get Attendance by Date Range
```bash
GET /api/attendance/user/:userId/range?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <jwt-token>
```

### 🏖️ Leave Routes

#### Apply for Leave
```bash
POST /api/leave/apply
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "type": "annual",
  "startDate": "2024-02-01",
  "endDate": "2024-02-05",
  "reason": "Family vacation"
}
```

#### Get User Leaves
```bash
GET /api/leave/user/:userId
Authorization: Bearer <jwt-token>
```

#### Approve/Reject Leave (Manager/HR/Admin)
```bash
PUT /api/leave/:id/status
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "status": "approved",
  "notes": "Approved for vacation"
}
```

### 💰 Payroll Routes

#### Generate Payroll
```bash
POST /api/payroll/generate
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "userId": "userId",
  "month": 1,
  "year": 2024,
  "allowances": 500,
  "deductions": 200,
  "overtime": 1000
}
```

#### Get User Payroll
```bash
GET /api/payroll/user/:userId
Authorization: Bearer <jwt-token>
```

#### Get Payroll by Month/Year
```bash
GET /api/payroll/user/:userId/period?month=1&year=2024
Authorization: Bearer <jwt-token>
```

##  Development Workflow

### Available Scripts

```bash
npm start        # Start production server
npm run dev      # Start development server with auto-restart
npm test         # Run tests (to be implemented)
```

### Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── config.js           # Environment configuration
│   │   └── db.js              # Database connection
│   ├── controllers/
│   │   ├── authController.js   # Authentication logic
│   │   ├── userController.js   # User management
│   │   ├── departmentController.js
│   │   ├── attendanceController.js
│   │   ├── leaveController.js
│   │   └── payrollController.js
│   ├── middleware/
│   │   └── authMiddleware.js   # JWT authentication
│   ├── models/
│   │   ├── userModel.js        # User schema
│   │   ├── departmentModel.js  # Department schema
│   │   ├── attendanceModel.js  # Attendance schema
│   │   ├── leaveModel.js       # Leave schema
│   │   ├── payrollModel.js     # Payroll schema
│   │   └── performanceModel.js # Performance schema
│   ├── routes/
│   │   ├── authRoutes.js       # Authentication routes
│   │   ├── userRoutes.js       # User management routes
│   │   ├── departmentRoutes.js
│   │   ├── attendanceRoutes.js
│   │   ├── leaveRoutes.js
│   │   └── payrollRoutes.js
│   ├── services/
│   │   ├── authService.js      # Authentication business logic
│   │   ├── userService.js      # User business logic
│   │   ├── attendanceService.js
│   │   ├── leaveService.js
│   │   └── payrollService.js
│   ├── utils/
│   │   ├── generateToken.js    # JWT token generation
│   │   ├── dateUtils.js        # Date calculations
│   │   ├── validation.js       # Input validation
│   │   └── responseHandler.js  # Response formatting
│   └── index.js               # Main application file
├── tutorials/
│   ├── models-guide.md        # Model documentation
│   └── project-overview.md    # Project overview
├── .env.example              # Environment template
├── .gitignore                # Git ignore rules
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

### Development Tips

1. **Use Development Mode**: `npm run dev` automatically restarts on file changes
2. **Environment Variables**: Copy `.env.example` to `.env` and configure
3. **Authentication**: Most endpoints require JWT token in Authorization header
4. **Role-Based Access**: Different endpoints have different permission requirements
5. **Error Handling**: All responses follow standardized error format
6. **Validation**: Input validation is handled at multiple layers

### Testing the API

#### Authentication Flow
```bash
# 1. Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "EMP001",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@company.com",
    "password": "SecurePass123!",
    "department": "departmentId",
    "position": "Software Developer",
    "role": "employee",
    "hireDate": "2024-01-15",
    "salary": 75000
  }'

# 2. Login to get JWT token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@company.com",
    "password": "SecurePass123!"
  }'

# 3. Use token for protected routes
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Role-Based Testing
```bash
# Admin user can access all endpoints
# HR user can manage users and departments
# Manager can manage team attendance and leave
# Employee can only access their own data
```

## 🧪 Testing

### 🌟 Swagger UI Testing (Recommended)

**Interactive Browser Testing** - The easiest way to test all API endpoints:

1. **Start the server**: `npm run dev`
2. **Open Swagger UI**: `http://localhost:5000/api-docs`
3. **Test Authentication**:
   - Register a new user via POST `/api/auth/register`
   - Login to get JWT token via POST `/api/auth/login`
   - Click "Authorize" button and enter: `Bearer YOUR_JWT_TOKEN`
4. **Test All Endpoints**: Click "Try it out" on any endpoint to test it
5. **View Real Responses**: See actual API responses with proper formatting

**Swagger UI Features**:
- ✅ **No additional setup required**
- ✅ **Test all endpoints in one place**
- ✅ **Built-in authentication handling**
- ✅ **Real-time request/response testing**
- ✅ **Comprehensive documentation**
- ✅ **Error scenario testing**

### Manual Testing with Postman

1. **Import Collection**: Create a Postman collection with all endpoints
2. **Environment Setup**: Configure base URL and authentication variables
3. **Test Authentication**: Test registration, login, and token refresh
4. **Test CRUD Operations**: Test create, read, update, delete for each model
5. **Test Role Permissions**: Verify role-based access control
6. **Test Error Scenarios**: Test validation errors and unauthorized access

### Testing Workflow

#### 1. Authentication Testing
```bash
# Using Swagger UI (Recommended)
1. Go to http://localhost:5000/api-docs
2. Test POST /api/auth/register
3. Test POST /api/auth/login
4. Copy JWT token and authorize

# Using curl
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

#### 2. Protected Endpoints Testing
```bash
# Using Swagger UI (Recommended)
1. Ensure you're authenticated (green lock icon)
2. Test any protected endpoint
3. View real-time responses

# Using curl
curl -X GET http://localhost:5000/api/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Automated Testing (Future)

```bash
# Unit tests for services and utilities
npm run test:unit

# Integration tests for API endpoints
npm run test:integration

# End-to-end tests
npm run test:e2e
```

## 🐛 Troubleshooting

### Common Issues

**1. Database Connection Failed**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solutions:**
- Ensure MongoDB is running
- Check `DB_URL` in `.env` file
- Verify MongoDB service status

**2. JWT Token Errors**
```
Error: JsonWebTokenError: invalid signature
```
**Solutions:**
- Ensure `JWT_SECRET` is set in `.env`
- Use the same secret for token generation and verification
- Check token expiration

**3. Role Permission Errors**
```
Error: Access denied. Admin role required.
```
**Solutions:**
- Verify user role in database
- Check if user is authenticated
- Ensure proper role assignment

**4. Validation Errors**
```
ValidationError: Path `email` is required
```
**Solutions:**
- Check request body format
- Verify required fields
- Validate email format and uniqueness

### Debug Mode

Enable detailed logging:

```env
NODE_ENV=development
```

### Database Inspection

**MongoDB Compass:**
1. Connect to your MongoDB instance
2. Navigate to `hrms_db` database
3. Inspect collections and documents

**MongoDB Shell:**
```bash
mongo
use hrms_db
db.users.find().pretty()
db.departments.find().pretty()
```

## 🔒 Security Features

### Current Implementation

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Fine-grained permissions
- **Input Validation**: Comprehensive data validation
- **Error Handling**: Secure error responses
- **CORS Configuration**: Cross-origin request handling

### Security Best Practices

1. **Environment Variables**: Sensitive data in `.env`
2. **Password Policy**: Strong password requirements
3. **Token Expiration**: Configurable JWT expiration
4. **Rate Limiting**: (To be implemented)
5. **HTTPS**: SSL/TLS in production
6. **Data Sanitization**: Input sanitization middleware

## 📈 Performance Considerations

### Database Optimization

- **Indexes**: Strategic indexing on frequently queried fields
- **Aggregation**: MongoDB aggregation for complex queries
- **Population**: Efficient document population
- **Pagination**: (To be implemented) for large datasets

### API Optimization

- **Caching**: Response caching strategies
- **Compression**: Response compression
- **Query Optimization**: Efficient database queries
- **Connection Pooling**: MongoDB connection pooling

## 🚀 Deployment

### Environment Configuration

```env
# Production Environment
NODE_ENV=production
PORT=5000
DB_URL=mongodb+srv://username:password@cluster.mongodb.net/hrms_db
JWT_SECRET=your-super-secure-production-secret
JWT_EXPIRE=7d
```

### Deployment Platforms

1. **Heroku**
   - Easy deployment with MongoDB Atlas
   - Environment variable management
   - Automatic scaling

2. **Railway**
   - Modern deployment platform
   - Git-based deployment
   - Built-in database options

3. **DigitalOcean**
   - VPS deployment
   - Docker containerization
   - Load balancing

4. **AWS/Azure**
   - Enterprise-level deployment
   - Managed database services
   - Auto-scaling capabilities

### Docker Deployment

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 📚 Learning Resources

### Documentation
- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [MongoDB Manual](https://docs.mongodb.com/)
- [JWT Documentation](https://jwt.io/)
- [Swagger/OpenAPI Documentation](https://swagger.io/specification/)

### Tutorials
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [RESTful API Design](https://restfulapi.net/)
- [MongoDB Schema Design](https://docs.mongodb.com/manual/core/data-modeling-introduction/)
- [API Testing with Swagger](https://swagger.io/tools/swagger-ui/)

### Project-Specific Resources
- `tutorials/models-guide.md` - Detailed model documentation
- `tutorials/project-overview.md` - Project architecture overview
- `tutorials/swagger-integration-guide.md` - **Swagger integration and API testing tutorial**

### Quick Start Guides
1. **API Testing**: Visit `http://localhost:5000/api-docs` for interactive testing
2. **Authentication**: Follow the Swagger UI workflow for JWT authentication
3. **Role Testing**: Test different user roles and permissions
4. **Error Handling**: Test validation and error scenarios

## 🔄 Future Enhancements

### Planned Features

1. **Advanced Authentication**
   - Two-factor authentication (2FA)
   - Social login integration
   - Password reset functionality

2. **Enhanced Reporting**
   - Advanced analytics dashboard
   - Custom report generation
   - Data visualization

3. **File Management**
   - Document upload/download
   - Profile image management
   - Payslip generation

4. **Real-time Features**
   - WebSocket integration
   - Real-time notifications
   - Live attendance tracking

5. **Mobile API**
   - Mobile-optimized endpoints
   - Push notifications
   - Offline capability

6. **Integration Features**
   - Third-party HR system integration
   - Email service integration
   - Calendar synchronization

### Performance Improvements

- API response caching
- Database query optimization
- Pagination implementation
- Background job processing

## 🎯 Learning Objectives

This project is designed to teach:

1. **Backend Development**
   - Node.js and Express.js fundamentals
   - RESTful API design principles
   - Database modeling and operations

2. **Authentication & Security**
   - JWT implementation
   - Password hashing and security
   - Role-based access control

3. **Database Management**
   - MongoDB operations
   - Schema design and relationships
   - Data validation and constraints

4. **Software Architecture**
   - MVC pattern implementation
   - Service layer architecture
   - Middleware patterns

5. **Best Practices**
   - Error handling strategies
   - Code organization and modularity
   - Environment configuration

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

### Code Style
- Follow ESLint configurations
- Use meaningful variable names
- Add JSDoc comments for functions
- Maintain consistent formatting

Happy coding! 🎉

For questions or support, please refer to the tutorials directory or create an issue in the repository.
