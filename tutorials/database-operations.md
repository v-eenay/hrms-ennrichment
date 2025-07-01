# Database Operations & MongoDB Concepts

This tutorial covers MongoDB database operations, Mongoose ODM usage, and best practices for data management in the HRMS system.

## 🎯 Learning Objectives

By the end of this tutorial, you will understand:
- MongoDB document database concepts
- Mongoose ODM features and benefits
- Database connection management
- CRUD operations in detail
- Query optimization techniques
- Data relationships and population
- Error handling and validation
- Performance considerations

## 🗄️ MongoDB Fundamentals

### **Document Database Concepts**

MongoDB is a NoSQL document database that stores data in flexible, JSON-like documents:

```javascript
// Traditional SQL Table Row
| id | first_name | last_name | email | department |
|----|------------|-----------|-------|------------|
| 1  | John       | Doe       | john@email.com | Engineering |

// MongoDB Document
{
  "_id": ObjectId("674a1b2c3d4e5f6789012345"),
  "employeeId": "EMP001",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@email.com",
  "department": "Engineering",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "zipCode": "10001"
  },
  "skills": ["JavaScript", "Node.js", "MongoDB"]
}
```

**Key differences from SQL**:
- **Flexible Schema**: Documents can have different fields
- **Nested Data**: Objects and arrays within documents
- **No Joins**: Related data through references or embedding
- **Horizontal Scaling**: Designed for distributed systems

### **Collections and Documents**

```javascript
// Database: hrms_db
//   Collection: employees (like a table)
//     Document: individual employee record (like a row)
//     Field: individual data point (like a column)

// Example collection structure
hrms_db
├── employees
│   ├── { _id: ObjectId(...), employeeId: "EMP001", ... }
│   ├── { _id: ObjectId(...), employeeId: "EMP002", ... }
│   └── { _id: ObjectId(...), employeeId: "EMP003", ... }
└── departments (future)
    ├── { _id: ObjectId(...), name: "Engineering", ... }
    └── { _id: ObjectId(...), name: "HR", ... }
```

## 🔌 Database Connection Management

### **Connection Setup**
```javascript
// Location: backend/src/config/db.js
import mongoose from "mongoose";
import { DB_URL } from "./config.js";

const connectDB = async () => {
  try {
    // Connect to MongoDB with options
    await mongoose.connect(DB_URL, {
      useNewUrlParser: true,      // Use new URL parser
      useUnifiedTopology: true,   // Use new topology engine
    });
    console.log('Connected to the database successfully');
  } catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1);  // Exit process on connection failure
  }
}

export { connectDB };
```

**Connection best practices**:
1. **Error Handling**: Always handle connection errors
2. **Process Exit**: Exit on critical connection failures
3. **Connection Options**: Use recommended MongoDB options
4. **Environment Variables**: Keep connection strings in .env files

### **Connection States**
```javascript
// Monitor connection states
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from MongoDB');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed through app termination');
  process.exit(0);
});
```

## 🔍 CRUD Operations Deep Dive

### **CREATE Operations**

```javascript
// Single document creation
const createEmployee = async (employeeData) => {
  try {
    // Method 1: Using create()
    const employee = await Employee.create(employeeData);
    
    // Method 2: Using new + save()
    const employee2 = new Employee(employeeData);
    await employee2.save();
    
    return employee;
  } catch (error) {
    if (error.name === 'ValidationError') {
      // Handle validation errors
      console.log('Validation failed:', error.message);
    } else if (error.code === 11000) {
      // Handle duplicate key errors
      console.log('Duplicate key error:', error.keyValue);
    }
    throw error;
  }
};

// Bulk creation
const createMultipleEmployees = async (employeesArray) => {
  try {
    const employees = await Employee.insertMany(employeesArray, {
      ordered: false  // Continue on individual failures
    });
    return employees;
  } catch (error) {
    console.log('Bulk insert error:', error);
    throw error;
  }
};
```

### **READ Operations**

```javascript
// Basic queries
const getAllEmployees = async () => {
  return await Employee.find();  // Get all documents
};

const getActiveEmployees = async () => {
  return await Employee.find({ status: 'active' });
};

const getEmployeeById = async (id) => {
  return await Employee.findById(id);
};

const getEmployeeByEmail = async (email) => {
  return await Employee.findOne({ email: email });
};

// Advanced queries with operators
const getEmployeesByDepartment = async (department) => {
  return await Employee.find({
    department: department,
    status: 'active'
  });
};

const getHighSalaryEmployees = async (minSalary) => {
  return await Employee.find({
    salary: { $gte: minSalary }  // Greater than or equal
  });
};

const searchEmployees = async (searchTerm) => {
  return await Employee.find({
    $or: [  // OR operator
      { firstName: { $regex: searchTerm, $options: 'i' } },  // Case-insensitive
      { lastName: { $regex: searchTerm, $options: 'i' } },
      { email: { $regex: searchTerm, $options: 'i' } }
    ]
  });
};
```

### **UPDATE Operations**

```javascript
// Update single document
const updateEmployee = async (id, updateData) => {
  try {
    // Method 1: findByIdAndUpdate (returns updated document)
    const employee = await Employee.findByIdAndUpdate(
      id,
      updateData,
      { 
        new: true,        // Return updated document
        runValidators: true  // Run schema validators
      }
    );
    
    if (!employee) {
      throw new Error('Employee not found');
    }
    
    return employee;
  } catch (error) {
    console.log('Update error:', error);
    throw error;
  }
};

// Update multiple documents
const updateEmployeesByDepartment = async (department, updateData) => {
  const result = await Employee.updateMany(
    { department: department },
    updateData
  );
  
  console.log(`Updated ${result.modifiedCount} employees`);
  return result;
};

// Increment salary for all employees
const giveRaise = async (percentage) => {
  const result = await Employee.updateMany(
    { status: 'active' },
    { $mul: { salary: 1 + (percentage / 100) } }  // Multiply operator
  );
  
  return result;
};
```

### **DELETE Operations**

```javascript
// Soft delete (recommended for business applications)
const deactivateEmployee = async (id) => {
  return await Employee.findByIdAndUpdate(
    id,
    { 
      status: 'inactive',
      deactivatedAt: new Date()
    },
    { new: true }
  );
};

// Hard delete (permanent removal)
const deleteEmployee = async (id) => {
  return await Employee.findByIdAndDelete(id);
};

// Bulk delete
const deleteInactiveEmployees = async () => {
  const result = await Employee.deleteMany({
    status: 'inactive',
    deactivatedAt: { $lt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) }  // Older than 1 year
  });
  
  console.log(`Deleted ${result.deletedCount} employees`);
  return result;
};
```

## 🔗 Relationships and Population

### **Reference Relationships**
```javascript
// Employee references manager (another employee)
const employeeSchema = new mongoose.Schema({
  // ... other fields
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'  // Reference to Employee model
  }
});

// Populate manager information
const getEmployeeWithManager = async (id) => {
  return await Employee
    .findById(id)
    .populate('manager', 'firstName lastName employeeId position');
};

// Populate multiple levels
const getEmployeeWithManagerChain = async (id) => {
  return await Employee
    .findById(id)
    .populate({
      path: 'manager',
      select: 'firstName lastName employeeId',
      populate: {
        path: 'manager',  // Manager's manager
        select: 'firstName lastName employeeId'
      }
    });
};

// Find all employees under a manager
const getTeamMembers = async (managerId) => {
  return await Employee.find({ manager: managerId });
};
```

### **Virtual Relationships**
```javascript
// Virtual field for team members
employeeSchema.virtual('teamMembers', {
  ref: 'Employee',
  localField: '_id',
  foreignField: 'manager'
});

// Use virtual population
const getManagerWithTeam = async (id) => {
  return await Employee
    .findById(id)
    .populate('teamMembers', 'firstName lastName employeeId position');
};
```

## ⚡ Query Optimization

### **Indexing Strategies**
```javascript
// Single field indexes
employeeSchema.index({ employeeId: 1 });    // Ascending
employeeSchema.index({ email: 1 });         // Unique queries
employeeSchema.index({ department: 1 });    // Filtering
employeeSchema.index({ status: 1 });        // Status queries

// Compound indexes
employeeSchema.index({ department: 1, status: 1 });  // Combined filtering
employeeSchema.index({ lastName: 1, firstName: 1 }); // Name sorting

// Text indexes for search
employeeSchema.index({
  firstName: 'text',
  lastName: 'text',
  email: 'text'
});

// Use text search
const searchEmployeesText = async (searchTerm) => {
  return await Employee.find({
    $text: { $search: searchTerm }
  });
};
```

### **Query Performance**
```javascript
// Efficient queries
const efficientQuery = async () => {
  return await Employee
    .find({ status: 'active' })        // Use indexed field
    .select('firstName lastName email') // Limit fields
    .limit(50)                         // Limit results
    .sort({ lastName: 1 });            // Use indexed sort
};

// Inefficient queries to avoid
const inefficientQuery = async () => {
  return await Employee
    .find({ salary: { $gt: 50000 } })  // No index on salary
    .sort({ createdAt: -1 });          // No index on createdAt
};

// Query explanation
const explainQuery = async () => {
  const explanation = await Employee
    .find({ department: 'Engineering' })
    .explain('executionStats');
  
  console.log('Query execution stats:', explanation);
};
```

## 🛠️ Advanced Database Operations

### **Aggregation Pipeline**
```javascript
// Department statistics
const getDepartmentStats = async () => {
  return await Employee.aggregate([
    { $match: { status: 'active' } },
    { 
      $group: {
        _id: '$department',
        count: { $sum: 1 },
        avgSalary: { $avg: '$salary' },
        maxSalary: { $max: '$salary' },
        minSalary: { $min: '$salary' }
      }
    },
    { $sort: { count: -1 } }
  ]);
};

// Salary ranges
const getSalaryRanges = async () => {
  return await Employee.aggregate([
    {
      $bucket: {
        groupBy: '$salary',
        boundaries: [0, 50000, 75000, 100000, 150000, Infinity],
        default: 'Other',
        output: {
          count: { $sum: 1 },
          employees: { $push: '$firstName' }
        }
      }
    }
  ]);
};
```

### **Transactions**
```javascript
// Multi-document transactions
const transferEmployee = async (employeeId, newDepartment, newManager) => {
  const session = await mongoose.startSession();
  
  try {
    await session.withTransaction(async () => {
      // Update employee
      await Employee.findByIdAndUpdate(
        employeeId,
        { 
          department: newDepartment,
          manager: newManager 
        },
        { session }
      );
      
      // Log the transfer
      await TransferLog.create([{
        employeeId,
        newDepartment,
        transferDate: new Date()
      }], { session });
    });
    
    console.log('Transfer completed successfully');
  } catch (error) {
    console.log('Transfer failed:', error);
    throw error;
  } finally {
    await session.endSession();
  }
};
```

## 🎓 Best Practices Summary

1. **Always Handle Errors**: Use try-catch blocks for database operations
2. **Use Indexes**: Index frequently queried fields
3. **Limit Results**: Use pagination for large datasets
4. **Select Fields**: Only retrieve needed fields
5. **Validate Input**: Use schema validation and custom validators
6. **Monitor Performance**: Use explain() to analyze queries
7. **Use Transactions**: For multi-document operations
8. **Connection Management**: Handle connection states properly

## 🔄 Next Steps

1. **Practice Queries**: Experiment with different MongoDB operators
2. **Performance Testing**: Analyze query performance with large datasets
3. **Advanced Aggregation**: Learn complex aggregation pipelines
4. **Replica Sets**: Understand MongoDB clustering
5. **Backup Strategies**: Learn data backup and recovery
6. **Monitoring**: Set up database monitoring and alerting

This foundation in database operations will serve you well in building robust, scalable applications with MongoDB and Mongoose.
