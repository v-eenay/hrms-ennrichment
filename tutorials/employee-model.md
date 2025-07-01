# Understanding the Employee Model

This tutorial explains the Employee model implementation in the HRMS system, covering Mongoose schemas, validation, relationships, and best practices for data modeling in MongoDB.

## 🎯 Learning Objectives

By the end of this tutorial, you will understand:
- How to define Mongoose schemas with validation
- Different field types and their use cases
- Data validation techniques and error handling
- Database relationships and references
- Performance optimization with indexes
- Best practices for data modeling

## 📋 Employee Model Overview

The Employee model represents the core entity in our HRMS system. It defines the structure, validation rules, and relationships for employee data.

```javascript
// Location: backend/src/models/employeeModel.js
import { mongoose } from "mongoose";

const employeeSchema = mongoose.Schema({
  // Schema definition
}, {
  timestamps: true  // Adds createdAt and updatedAt automatically
});

export const Employee = mongoose.model("Employee", employeeSchema);
```

## 🔍 Field-by-Field Analysis

### **1. Employee ID Field**
```javascript
employeeId: {
  type: String,
  required: true,
  unique: true,
  trim: true,
}
```

**Explanation**:
- `type: String`: Stores text data (e.g., "EMP001")
- `required: true`: Field must be provided when creating an employee
- `unique: true`: No two employees can have the same ID
- `trim: true`: Removes whitespace from beginning and end

**Why this design?**:
- Human-readable identifiers are easier to reference
- Unique constraint prevents duplicate employees
- Trimming prevents accidental whitespace issues

**Example usage**:
```javascript
// Valid
{ employeeId: "EMP001" }
{ employeeId: " EMP002 " } // Will be trimmed to "EMP002"

// Invalid - will throw validation error
{ employeeId: "" }        // Required field missing
{ employeeId: "EMP001" }  // Duplicate ID (if already exists)
```

### **2. Name Fields**
```javascript
firstName: {
  type: String,
  required: true,
  trim: true,
},
lastName: {
  type: String,
  required: true,
  trim: true,
}
```

**Design decisions**:
- Separate first and last names for flexibility
- Both required for complete employee records
- Trimmed to handle input inconsistencies

**Best practices demonstrated**:
```javascript
// Good naming convention
{ firstName: "John", lastName: "Doe" }

// Handles edge cases
{ firstName: " Jane ", lastName: " Smith " } // Trimmed automatically
```

### **3. Email Field with Advanced Validation**
```javascript
email: {
  type: String,
  required: true,
  unique: true,
  trim: true,
  lowercase: true,
  match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address'],
}
```

**Advanced features explained**:
- `lowercase: true`: Converts email to lowercase automatically
- `match`: Regular expression validation for email format
- Custom error message for validation failures

**Regex breakdown**:
```javascript
/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
// ^\w+           - Starts with word characters
// ([.-]?\w+)*    - Optional dots/hyphens followed by word characters
// @              - Required @ symbol
// \w+([.-]?\w+)* - Domain name with optional dots/hyphens
// (\.\w{2,3})+   - Domain extension (.com, .org, etc.)
// $              - End of string
```

**Example validation**:
```javascript
// Valid emails
"john.doe@company.com"     // Standard format
"jane-smith@company.org"   // Hyphen in name
"ADMIN@COMPANY.COM"        // Converted to lowercase

// Invalid emails (will throw validation error)
"invalid-email"            // Missing @ and domain
"user@"                    // Missing domain
"@company.com"             // Missing username
```

### **4. Phone Number with Pattern Validation**
```javascript
phone: {
  type: String,
  trim: true,
  match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number'],
}
```

**Pattern explanation**:
- `[\+]?`: Optional plus sign for international numbers
- `[1-9]`: First digit must be 1-9 (not 0)
- `[\d]{0,15}`: Up to 15 additional digits
- Field is optional (no `required: true`)

**Valid phone formats**:
```javascript
"+1234567890"    // International format
"1234567890"     // Domestic format
"+44123456789"   // UK format
```

### **5. Date Field with Custom Validation**
```javascript
hireDate: {
  type: Date,
  required: true,
  validate: {
    validator: function(value) {
      return value <= new Date();
    },
    message: 'Hire date cannot be in the future'
  }
}
```

**Custom validation explained**:
- `validator`: Function that returns true/false
- `this` refers to the document being validated
- Custom error message for business rule violations

**Example usage**:
```javascript
// Valid dates
new Date('2024-01-15')     // Past date
new Date()                 // Today

// Invalid date (throws validation error)
new Date('2025-12-31')     // Future date
```

### **6. Numeric Field with Range Validation**
```javascript
salary: {
  type: Number,
  required: true,
  min: [0, 'Salary must be a positive number'],
}
```

**Validation features**:
- `min: [value, message]`: Minimum value with custom error
- Ensures business rule: salaries cannot be negative

### **7. Enum Field for Status**
```javascript
status: {
  type: String,
  required: true,
  enum: ['active', 'inactive'],
  default: 'active',
}
```

**Enum validation**:
- Only allows predefined values
- Prevents typos and invalid statuses
- Default value for new employees

### **8. Reference Field for Relationships**
```javascript
manager: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Employee',
  default: null,
}
```

**Relationship features**:
- `ObjectId`: References another document's ID
- `ref: 'Employee'`: Points to Employee model (self-reference)
- `default: null`: Optional field for employees without managers

## 🔗 Understanding Relationships

### **Self-Referencing Relationship**
```javascript
// Employee can reference another Employee as manager
const employee = {
  name: "John Doe",
  manager: "674a1b2c3d4e5f6789012345" // ObjectId of manager
};
```

### **Population Example**
```javascript
// Retrieve employee with manager details
const employee = await Employee
  .findById(employeeId)
  .populate('manager', 'firstName lastName employeeId');

// Result includes manager information
{
  _id: "674a1b2c3d4e5f6789012346",
  firstName: "John",
  lastName: "Doe",
  manager: {
    _id: "674a1b2c3d4e5f6789012345",
    firstName: "Sarah",
    lastName: "Johnson",
    employeeId: "EMP001"
  }
}
```

## ⚡ Performance Optimization

### **Database Indexes**
```javascript
// Create indexes for better query performance
employeeSchema.index({ employeeId: 1 });  // Unique queries
employeeSchema.index({ email: 1 });       // Login/search
employeeSchema.index({ department: 1 });  // Filtering
employeeSchema.index({ status: 1 });      // Status filtering
```

**Index benefits**:
- Faster queries on indexed fields
- Improved performance for filtering and searching
- Essential for large datasets

### **Query Performance Examples**
```javascript
// Fast queries (using indexes)
Employee.findOne({ employeeId: "EMP001" });     // Index on employeeId
Employee.find({ department: "Engineering" });   // Index on department
Employee.find({ status: "active" });            // Index on status

// Slower queries (no indexes)
Employee.find({ salary: { $gt: 50000 } });      // No index on salary
Employee.find({ firstName: "John" });           // No index on firstName
```

## 🛠️ Practical Examples

### **Creating an Employee**
```javascript
const newEmployee = {
  employeeId: "EMP001",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@company.com",
  phone: "+1234567890",
  department: "Engineering",
  position: "Software Developer",
  hireDate: new Date("2024-01-15"),
  salary: 75000,
  status: "active",
  manager: null
};

try {
  const employee = await Employee.create(newEmployee);
  console.log("Employee created:", employee);
} catch (error) {
  console.error("Validation error:", error.message);
}
```

### **Handling Validation Errors**
```javascript
try {
  await Employee.create({
    employeeId: "EMP001",  // Duplicate ID
    firstName: "",         // Empty required field
    email: "invalid-email" // Invalid format
  });
} catch (error) {
  if (error.code === 11000) {
    // Duplicate key error
    console.log("Employee ID already exists");
  } else if (error.name === 'ValidationError') {
    // Field validation errors
    Object.keys(error.errors).forEach(field => {
      console.log(`${field}: ${error.errors[field].message}`);
    });
  }
}
```

## 🎓 Key Learning Points

1. **Schema Design**: Structure data with appropriate types and constraints
2. **Validation**: Use built-in and custom validators for data integrity
3. **Relationships**: Model connections between entities
4. **Performance**: Use indexes for frequently queried fields
5. **Error Handling**: Gracefully handle validation and constraint violations
6. **Business Rules**: Implement domain-specific validation logic

## 🔄 Next Steps

1. **Practice**: Create variations of the Employee model
2. **Extend**: Add new fields like address or emergency contact
3. **Relationships**: Create Department model with references
4. **Validation**: Add more complex business rules
5. **Testing**: Write tests for model validation
6. **Performance**: Analyze query performance with explain()

This Employee model serves as a foundation for understanding MongoDB document design and Mongoose schema patterns in professional applications.
