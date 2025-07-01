# HRMS Backend Architecture & Design Patterns

This guide explains the architectural decisions, design patterns, and folder structure used in the HRMS backend implementation. Understanding these concepts will help you build scalable and maintainable Node.js applications.

## 🏗️ Project Architecture Overview

The HRMS backend follows a **layered architecture** pattern that separates concerns and promotes code organization. This approach makes the codebase easier to understand, test, and maintain.

```
HRMS Backend Architecture
┌─────────────────────────────────────────────────────────┐
│                    Client Layer                         │
│              (Frontend/API Clients)                     │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                   API Layer                             │
│              (Express Routes)                           │
│         • Employee Routes                               │
│         • Request/Response Handling                     │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                Business Logic Layer                     │
│              (Controllers - Future)                     │
│         • Data Validation                               │
│         • Business Rules                                │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                 Data Access Layer                       │
│              (Mongoose Models)                          │
│         • Employee Model                                │
│         • Database Operations                           │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                 Database Layer                          │
│                 (MongoDB)                               │
│         • Data Storage                                  │
│         • Indexing & Queries                            │
└─────────────────────────────────────────────────────────┘
```

## 📁 Current Folder Structure

```
backend/
├── src/                     # Source code directory
│   ├── config/             # Configuration files
│   │   ├── config.js       # Environment variables
│   │   └── db.js          # Database connection
│   ├── models/             # Data models (Mongoose schemas)
│   │   └── employeeModel.js # Employee schema definition
│   ├── routes/             # API route definitions
│   │   └── employeeRoutes.js # Employee CRUD endpoints
│   ├── controllers/        # Business logic (currently empty)
│   ├── middleware/         # Custom middleware (currently empty)
│   ├── services/          # Business services (currently empty)
│   └── utils/             # Utility functions (currently empty)
├── sample-data/           # Sample data for testing
│   └── employees.json     # Sample employee records
├── package.json           # Dependencies and scripts
└── README.md             # Backend documentation
```

## 🎯 Design Patterns Explained

### 1. **MVC Pattern (Model-View-Controller)**

Although we don't have a traditional "View" layer (since we're building an API), we follow MVC principles:

- **Model** (`models/`): Defines data structure and database operations
- **Controller** (`routes/` currently, `controllers/` planned): Handles business logic
- **View**: JSON responses sent to clients

### 2. **Separation of Concerns**

Each directory has a specific responsibility:

#### **`config/` Directory**
**Purpose**: Centralized configuration management
```javascript
// config/config.js - Environment variables
export const PORT = process.env.PORT;
export const DB_URL = process.env.DB_URL;

// config/db.js - Database connection logic
export const connectDB = async () => {
  await mongoose.connect(DB_URL);
};
```

**Why this matters**: 
- Environment-specific settings are isolated
- Easy to modify configuration without touching business logic
- Supports different environments (development, testing, production)

#### **`models/` Directory**
**Purpose**: Data structure definitions and database schema
```javascript
// models/employeeModel.js
const employeeSchema = mongoose.Schema({
  employeeId: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  // ... other fields
});
```

**Why this matters**:
- Enforces data consistency across the application
- Centralizes validation rules
- Provides a single source of truth for data structure

#### **`routes/` Directory**
**Purpose**: API endpoint definitions and request handling
```javascript
// routes/employeeRoutes.js
router.post('/', async (req, res) => {
  // Handle employee creation
});
router.get('/', async (req, res) => {
  // Handle employee retrieval
});
```

**Why this matters**:
- Clear API structure and documentation
- Centralized request/response handling
- Easy to add new endpoints

### 3. **Repository Pattern (Implicit)**

While not explicitly implemented, our Mongoose models act as repositories:
```javascript
// Data access through model methods
const employees = await Employee.find(filter);
const employee = await Employee.create(newEmployee);
```

## 🚀 Scalability Planning

As the project grows, here's how the architecture will evolve:

### **Phase 1: Current Implementation**
```
Routes → Models → Database
```
- Routes handle both API logic and business logic
- Direct model access from routes
- Simple but not scalable for complex applications

### **Phase 2: Adding Controllers**
```
Routes → Controllers → Models → Database
```
- **Controllers** will handle business logic
- **Routes** will focus only on HTTP concerns
- Better separation of concerns

Example controller structure:
```javascript
// controllers/employeeController.js
export const createEmployee = async (req, res) => {
  try {
    // Validation logic
    // Business rules
    // Model operations
    // Response formatting
  } catch (error) {
    // Error handling
  }
};
```

### **Phase 3: Adding Services**
```
Routes → Controllers → Services → Models → Database
```
- **Services** will handle complex business logic
- **Controllers** will orchestrate services
- **Models** will focus purely on data access

Example service structure:
```javascript
// services/employeeService.js
export const employeeService = {
  async createEmployee(employeeData) {
    // Complex business logic
    // Data transformation
    // Multiple model interactions
  }
};
```

### **Phase 4: Adding Middleware**
```
Request → Middleware → Routes → Controllers → Services → Models → Database
```
- **Authentication middleware**
- **Validation middleware**
- **Logging middleware**
- **Error handling middleware**

## 🔧 Current Implementation Details

### **Database Connection Pattern**
```javascript
// Centralized connection management
const connectDB = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log('Connected to the database successfully');
  } catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1);
  }
}
```

**Benefits**:
- Single connection point
- Graceful error handling
- Easy to add connection pooling later

### **Model Definition Pattern**
```javascript
// Schema with validation and indexes
const employeeSchema = mongoose.Schema({
  // Field definitions with validation
}, {
  timestamps: true  // Automatic createdAt/updatedAt
});

// Performance indexes
employeeSchema.index({ employeeId: 1 });
employeeSchema.index({ email: 1 });
```

**Benefits**:
- Built-in validation
- Automatic timestamps
- Performance optimization through indexes

### **Route Organization Pattern**
```javascript
// Modular route definitions
const router = express.Router();

// CRUD operations
router.post('/', createEmployee);
router.get('/', getAllEmployees);
router.get('/:id', getEmployeeById);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);
```

**Benefits**:
- RESTful API design
- Clear endpoint structure
- Easy to test and document

## 📊 Data Flow Diagram

```
Client Request
      │
      ▼
┌─────────────┐
│   Express   │ ← Middleware (CORS, JSON parsing)
│   Router    │
└─────────────┘
      │
      ▼
┌─────────────┐
│   Route     │ ← Validation, Error handling
│   Handler   │
└─────────────┘
      │
      ▼
┌─────────────┐
│  Mongoose   │ ← Schema validation, Indexes
│   Model     │
└─────────────┘
      │
      ▼
┌─────────────┐
│  MongoDB    │ ← Data persistence
│  Database   │
└─────────────┘
      │
      ▼
JSON Response
```

## 🎓 Learning Outcomes

By studying this architecture, students will learn:

1. **Separation of Concerns**: How to organize code by responsibility
2. **Scalable Structure**: How to plan for future growth
3. **Design Patterns**: Common patterns in web development
4. **Database Design**: Schema definition and optimization
5. **API Design**: RESTful endpoint organization
6. **Error Handling**: Graceful error management
7. **Configuration Management**: Environment-based settings

## 🔄 Next Steps for Enhancement

As you continue developing the HRMS system, consider:

1. **Add Controllers**: Move business logic from routes
2. **Implement Services**: Handle complex business operations
3. **Add Middleware**: Authentication, validation, logging
4. **Error Handling**: Centralized error management
5. **Testing**: Unit and integration tests
6. **Documentation**: API documentation with Swagger
7. **Security**: Input sanitization, rate limiting
8. **Performance**: Caching, query optimization

This architecture provides a solid foundation for building a professional-grade HRMS application while maintaining code quality and scalability.
