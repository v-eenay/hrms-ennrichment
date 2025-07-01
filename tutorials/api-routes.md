# API Routes & Database Operations Tutorial

This tutorial covers the implementation of RESTful API routes in the HRMS system, explaining HTTP methods, database operations, error handling, and best practices for building robust APIs.

## 🎯 Learning Objectives

By the end of this tutorial, you will understand:
- RESTful API design principles
- Express.js route implementation
- CRUD operations with Mongoose
- Error handling and validation
- HTTP status codes and responses
- Query filtering and population
- API testing techniques

## 🌐 RESTful API Overview

Our Employee API follows REST (Representational State Transfer) principles:

| HTTP Method | Endpoint | Purpose | Database Operation |
|-------------|----------|---------|-------------------|
| POST | `/employees` | Create employee | `Employee.create()` |
| GET | `/employees` | Get all employees | `Employee.find()` |
| GET | `/employees/:id` | Get specific employee | `Employee.findById()` |
| PUT | `/employees/:id` | Update employee | `Employee.findByIdAndUpdate()` |
| DELETE | `/employees/:id` | Deactivate employee | `Employee.findByIdAndUpdate()` |

## 📁 Route File Structure

```javascript
// Location: backend/src/routes/employeeRoutes.js
import express from 'express'
import { Employee } from '../models/employeeModel.js'

const router = express.Router()

// Middleware for JSON parsing
router.use(express.json())

// Route definitions
router.post('/', createEmployee)
router.get('/', getAllEmployees)
router.get('/:id', getEmployeeById)
router.put('/:id', updateEmployee)
router.delete('/:id', deactivateEmployee)

export default router
```

## 🔍 Route Implementation Deep Dive

### **1. CREATE Employee (POST /employees)**

```javascript
router.post('/', async (req, res) => {
  try {
    // Step 1: Validate required fields
    if (
      !req.body.employeeId ||
      !req.body.firstName ||
      !req.body.lastName ||
      !req.body.email ||
      !req.body.department ||
      !req.body.position ||
      !req.body.hireDate ||
      req.body.salary === undefined
    ) {
      return res.status(400).send({
        message: 'Send all required fields: employeeId, firstName, lastName, email, department, position, hireDate, salary',
      });
    }

    // Step 2: Prepare employee data
    const newEmployee = {
      employeeId: req.body.employeeId,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      department: req.body.department,
      position: req.body.position,
      hireDate: req.body.hireDate,
      salary: req.body.salary,
      status: req.body.status || 'active',
      manager: req.body.manager || null,
    }

    // Step 3: Create employee in database
    const employee = await Employee.create(newEmployee);
    
    // Step 4: Return success response
    return res.status(201).send(employee);
    
  } catch (error) {
    console.log(error.message);
    
    // Handle duplicate key errors (unique constraints)
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).send({
        message: `${field} already exists. Please use a different ${field}.`
      });
    }
    
    // Handle other errors
    res.status(500).send({ message: error.message });
  }
});
```

**Key concepts explained**:

1. **Input Validation**: Check required fields before database operation
2. **Data Preparation**: Structure data according to model schema
3. **Database Operation**: Use `Employee.create()` for insertion
4. **Error Handling**: Different responses for different error types
5. **HTTP Status Codes**: 
   - `201`: Created successfully
   - `400`: Bad request (validation error)
   - `500`: Server error

**Example request**:
```bash
curl -X POST http://localhost:5000/employees \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "EMP001",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@company.com",
    "department": "Engineering",
    "position": "Software Developer",
    "hireDate": "2024-01-15",
    "salary": 75000
  }'
```

### **2. READ All Employees (GET /employees)**

```javascript
router.get('/', async (req, res) => {
  try {
    // Step 1: Build filter object from query parameters
    const filter = {};
    if (req.query.department) filter.department = req.query.department;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.position) filter.position = req.query.position;
    
    // Step 2: Query database with filters and populate manager
    const employees = await Employee
      .find(filter)
      .populate('manager', 'firstName lastName employeeId');
    
    // Step 3: Handle empty results
    if (employees.length === 0) {
      return res.status(404).send({ message: 'No employees found' });
    }
    
    // Step 4: Return structured response
    return res.status(200).json({
      message: 'Employees retrieved successfully',
      count: employees.length,
      employees: employees
    });
    
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});
```

**Advanced features**:

1. **Dynamic Filtering**: Build filter object from query parameters
2. **Population**: Include manager details in response
3. **Structured Response**: Consistent response format with metadata
4. **Empty Result Handling**: Appropriate response when no data found

**Example requests**:
```bash
# Get all employees
curl http://localhost:5000/employees

# Filter by department
curl "http://localhost:5000/employees?department=Engineering"

# Multiple filters
curl "http://localhost:5000/employees?department=HR&status=active"
```

**Response structure**:
```json
{
  "message": "Employees retrieved successfully",
  "count": 2,
  "employees": [
    {
      "_id": "674a1b2c3d4e5f6789012345",
      "employeeId": "EMP001",
      "firstName": "John",
      "lastName": "Doe",
      "manager": {
        "_id": "674a1b2c3d4e5f6789012346",
        "firstName": "Sarah",
        "lastName": "Johnson",
        "employeeId": "EMP002"
      }
    }
  ]
}
```

### **3. READ Single Employee (GET /employees/:id)**

```javascript
router.get('/:id', async (req, res) => {
  try {
    // Step 1: Extract ID from URL parameters
    const { id } = req.params;
    
    // Step 2: Find employee by ID and populate manager
    const employee = await Employee
      .findById(id)
      .populate('manager', 'firstName lastName employeeId');
    
    // Step 3: Handle not found case
    if (!employee) {
      return res.status(404).send({ message: 'Employee not found' });
    }
    
    // Step 4: Return employee data
    return res.status(200).json({
      message: 'Employee retrieved successfully',
      employee: employee
    });
    
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});
```

**Key concepts**:
1. **URL Parameters**: Extract ID from route parameter
2. **Single Document Query**: Use `findById()` for specific records
3. **Not Found Handling**: Return 404 for non-existent resources
4. **Population**: Include related data in response

### **4. UPDATE Employee (PUT /employees/:id)**

```javascript
router.put('/:id', async (req, res) => {
  try {
    // Step 1: Validate required fields
    if (
      !req.body.employeeId ||
      !req.body.firstName ||
      !req.body.lastName ||
      !req.body.email ||
      !req.body.department ||
      !req.body.position ||
      !req.body.hireDate ||
      req.body.salary === undefined
    ) {
      return res.status(400).send({
        message: 'Send all required fields: employeeId, firstName, lastName, email, department, position, hireDate, salary',
      });
    }

    // Step 2: Update employee in database
    const { id } = req.params;
    const result = await Employee.findByIdAndUpdate(
      id, 
      req.body, 
      { new: true }  // Return updated document
    );
    
    // Step 3: Handle not found case
    if (!result) {
      return res.status(404).send({ message: 'Employee not found' });
    }
    
    // Step 4: Return success response
    return res.status(200).send({
      message: 'Employee updated successfully',
      employee: result
    });
    
  } catch (error) {
    console.log(error.message);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).send({
        message: `${field} already exists. Please use a different ${field}.`
      });
    }
    
    res.status(500).send({ message: error.message });
  }
});
```

**Update operation features**:
1. **Validation**: Same validation as create operation
2. **Atomic Update**: `findByIdAndUpdate()` in single operation
3. **Return Updated Document**: `{ new: true }` option
4. **Duplicate Handling**: Handle unique constraint violations

### **5. DELETE Employee (Soft Delete)**

```javascript
router.delete('/:id', async (req, res) => {
  try {
    // Step 1: Extract ID from parameters
    const { id } = req.params;
    
    // Step 2: Soft delete - set status to inactive
    const result = await Employee.findByIdAndUpdate(
      id, 
      { status: 'inactive' }, 
      { new: true }
    );
    
    // Step 3: Handle not found case
    if (!result) {
      return res.status(404).send({ message: 'Employee not found' });
    }
    
    // Step 4: Return success response
    return res.status(200).send({
      message: 'Employee deactivated successfully',
      employee: result
    });
    
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});
```

**Soft delete benefits**:
1. **Data Preservation**: Don't permanently delete records
2. **Audit Trail**: Maintain history of employee changes
3. **Reversible**: Can reactivate employees if needed
4. **Referential Integrity**: Maintain manager relationships

## 🔧 Database Operations Explained

### **Mongoose Query Methods**

```javascript
// Create operations
Employee.create(data)                    // Insert new document
Employee.insertMany([data1, data2])      // Insert multiple documents

// Read operations
Employee.find()                          // Get all documents
Employee.find({ status: 'active' })     // Get with filter
Employee.findById(id)                    // Get by ID
Employee.findOne({ email: 'user@email.com' }) // Get single document

// Update operations
Employee.findByIdAndUpdate(id, data)     // Update by ID
Employee.updateOne({ _id: id }, data)    // Update single document
Employee.updateMany({ dept: 'IT' }, data) // Update multiple documents

// Delete operations
Employee.findByIdAndDelete(id)           // Hard delete by ID
Employee.deleteOne({ _id: id })          // Hard delete single
Employee.deleteMany({ status: 'inactive' }) // Hard delete multiple
```

### **Query Options and Modifiers**

```javascript
// Population (join-like operation)
Employee.find().populate('manager', 'firstName lastName')

// Sorting
Employee.find().sort({ lastName: 1, firstName: 1 })  // Ascending
Employee.find().sort({ salary: -1 })                 // Descending

// Limiting and pagination
Employee.find().limit(10)                            // First 10 records
Employee.find().skip(20).limit(10)                   // Records 21-30

// Field selection
Employee.find().select('firstName lastName email')   // Only specific fields
Employee.find().select('-password')                  // Exclude password field

// Chaining operations
Employee
  .find({ status: 'active' })
  .populate('manager')
  .sort({ lastName: 1 })
  .limit(50)
  .select('firstName lastName department')
```

## 🧪 Testing API Endpoints

### **Using curl**
```bash
# Create employee
curl -X POST http://localhost:5000/employees \
  -H "Content-Type: application/json" \
  -d '{"employeeId":"EMP001","firstName":"John","lastName":"Doe","email":"john@company.com","department":"IT","position":"Developer","hireDate":"2024-01-01","salary":70000}'

# Get all employees
curl http://localhost:5000/employees

# Get specific employee
curl http://localhost:5000/employees/674a1b2c3d4e5f6789012345

# Update employee
curl -X PUT http://localhost:5000/employees/674a1b2c3d4e5f6789012345 \
  -H "Content-Type: application/json" \
  -d '{"employeeId":"EMP001","firstName":"John","lastName":"Smith","email":"john.smith@company.com","department":"IT","position":"Senior Developer","hireDate":"2024-01-01","salary":80000}'

# Deactivate employee
curl -X DELETE http://localhost:5000/employees/674a1b2c3d4e5f6789012345
```

### **Using Postman**
1. Create a new collection for HRMS API
2. Add requests for each endpoint
3. Set up environment variables for base URL
4. Create test scripts for automated testing

## 🎓 Best Practices Demonstrated

1. **Consistent Error Handling**: Standardized error responses
2. **Input Validation**: Check required fields before processing
3. **HTTP Status Codes**: Appropriate codes for different scenarios
4. **Structured Responses**: Consistent response format
5. **Soft Deletes**: Preserve data integrity
6. **Population**: Include related data efficiently
7. **Query Filtering**: Dynamic filtering based on parameters

## 🔄 Next Steps

1. **Add Pagination**: Implement limit and offset for large datasets
2. **Advanced Filtering**: Add search, date ranges, salary ranges
3. **Sorting**: Allow client-specified sorting options
4. **Validation Middleware**: Extract validation to reusable middleware
5. **Authentication**: Add user authentication and authorization
6. **Rate Limiting**: Prevent API abuse
7. **API Documentation**: Generate documentation with Swagger

This API implementation provides a solid foundation for building scalable and maintainable REST APIs with Express.js and MongoDB.

## 📚 Additional Resources

- [Express.js Routing Guide](https://expressjs.com/en/guide/routing.html)
- [Mongoose Query Documentation](https://mongoosejs.com/docs/queries.html)
- [HTTP Status Codes Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [RESTful API Design Best Practices](https://restfulapi.net/)
