# Building a RESTful API with Express.js: A Step-by-Step Tutorial

This tutorial will guide you through creating a basic RESTful API using Express.js. By the end, you'll understand how to implement CRUD operations, different HTTP methods, and how to test your API.

## Table of Contents
1. [Introduction to RESTful APIs](#introduction-to-restful-apis)
2. [Setting Up an Express Project](#setting-up-an-express-project)
3. [Creating API Endpoints](#creating-api-endpoints)
4. [Implementing HTTP Methods](#implementing-http-methods)
5. [Testing Your API](#testing-your-api)

## Introduction to RESTful APIs

REST (Representational State Transfer) is an architectural style for designing networked applications. A RESTful API uses HTTP requests to perform CRUD (Create, Read, Update, Delete) operations on resources.

### Key Principles of REST:
- **Stateless**: Each request from client to server must contain all information needed to understand and complete the request.
- **Client-Server Architecture**: Separation of concerns between client and server.
- **Cacheable**: Responses must define themselves as cacheable or non-cacheable.
- **Uniform Interface**: Resources are identified in requests, manipulated through representations, and self-descriptive messages.

### HTTP Methods in REST:

| Method | Purpose | Description |
|--------|---------|-------------|
| GET | Read | Retrieve a resource or collection of resources |
| POST | Create | Create a new resource |
| PUT | Update | Update a resource entirely |
| PATCH | Partial Update | Update parts of a resource |
| DELETE | Delete | Remove a resource |
| HEAD | Check Existence | Like GET but only returns headers (no body) |
| OPTIONS | Get Available Methods | Returns supported HTTP methods for the resource |
| TRACE | Diagnostic | Echo request for debugging |

## Setting Up an Express Project

### Step 1: Initialize a Node.js Project
```bash
# Create a new directory for your project
mkdir express-api-tutorial
cd express-api-tutorial

# Initialize a new Node.js project
npm init -y
```

### Step 2: Install Required Dependencies
```bash
# Install Express and other useful packages
npm install express body-parser cors morgan

# Install development dependencies
npm install --save-dev nodemon jest supertest
```

### Step 3: Update package.json Scripts
Add these scripts to your package.json:

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js",
  "test": "jest"
}
```

### Step 4: Create the Server File

Create a file named `server.js` in your project root:

```javascript
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('dev')); // Logger middleware

// Import routes
const studentsRouter = require('./routes/students');

// Routes
app.use('/api/students', studentsRouter);

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

// 404 Route
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app; // For testing
```

### Step 5: Create a Routes Folder and Route Files

Create a folder named `routes` and add your route files:

```bash
mkdir routes
```

## Creating API Endpoints

Let's create a file named `routes/students.js` to handle student-related endpoints:

```javascript
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Path to students.json file
const studentsFilePath = path.join(__dirname, '..', 'data', 'students.json');

// Helper function to read students data
const getStudentsData = () => {
  try {
    const data = fs.readFileSync(studentsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading students data:', error);
    return { students: [] };
  }
};

// Helper function to write students data
const saveStudentsData = (data) => {
  try {
    fs.writeFileSync(studentsFilePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing students data:', error);
    return false;
  }
};

// Define routes here (see next section)

module.exports = router;
```

## Implementing HTTP Methods

Now let's implement various HTTP methods in our `routes/students.js` file:

### 1. GET - Retrieve Resources

```javascript
// GET all students
router.get('/', (req, res) => {
  const data = getStudentsData();
  res.json(data.students);
});

// GET a specific student by roll
router.get('/:roll', (req, res) => {
  const roll = parseInt(req.params.roll);
  const data = getStudentsData();
  const student = data.students.find(s => s.roll === roll);
  
  if (!student) {
    return res.status(404).json({ message: 'Student not found' });
  }
  
  res.json(student);
});
```

### 2. POST - Create Resources

```javascript
// POST - create a new student
router.post('/', (req, res) => {
  const { name, marks } = req.body;
  
  if (!name || !marks) {
    return res.status(400).json({ message: 'Name and marks are required' });
  }
  
  const data = getStudentsData();
  
  // Generate a new roll number
  const maxRoll = data.students.reduce((max, student) => Math.max(max, student.roll), 0);
  const newRoll = maxRoll + 1;
  
  const newStudent = {
    roll: newRoll,
    name,
    marks
  };
  
  data.students.push(newStudent);
  
  if (saveStudentsData(data)) {
    res.status(201).json(newStudent);
  } else {
    res.status(500).json({ message: 'Error saving student data' });
  }
});
```

### 3. PUT - Update Resources

```javascript
// PUT - update an existing student
router.put('/:roll', (req, res) => {
  const roll = parseInt(req.params.roll);
  const { name, marks } = req.body;
  
  if (!name && !marks) {
    return res.status(400).json({ message: 'Name or marks are required for update' });
  }
  
  const data = getStudentsData();
  const studentIndex = data.students.findIndex(s => s.roll === roll);
  
  if (studentIndex === -1) {
    return res.status(404).json({ message: 'Student not found' });
  }
  
  // Update student data
  if (name) data.students[studentIndex].name = name;
  if (marks) data.students[studentIndex].marks = marks;
  
  if (saveStudentsData(data)) {
    res.json(data.students[studentIndex]);
  } else {
    res.status(500).json({ message: 'Error updating student data' });
  }
});
```

### 4. PATCH - Partially Update Resources

```javascript
// PATCH - partially update a student
router.patch('/:roll', (req, res) => {
  const roll = parseInt(req.params.roll);
  const updates = req.body;
  
  const data = getStudentsData();
  const studentIndex = data.students.findIndex(s => s.roll === roll);
  
  if (studentIndex === -1) {
    return res.status(404).json({ message: 'Student not found' });
  }
  
  // Apply updates
  Object.keys(updates).forEach(key => {
    if (key !== 'roll') { // Don't allow roll to be updated
      data.students[studentIndex][key] = updates[key];
    }
  });
  
  if (saveStudentsData(data)) {
    res.json(data.students[studentIndex]);
  } else {
    res.status(500).json({ message: 'Error updating student data' });
  }
});
```

### 5. DELETE - Remove Resources

```javascript
// DELETE - remove a student
router.delete('/:roll', (req, res) => {
  const roll = parseInt(req.params.roll);
  
  const data = getStudentsData();
  const initialLength = data.students.length;
  data.students = data.students.filter(s => s.roll !== roll);
  
  if (data.students.length === initialLength) {
    return res.status(404).json({ message: 'Student not found' });
  }
  
  if (saveStudentsData(data)) {
    res.json({ message: 'Student deleted successfully' });
  } else {
    res.status(500).json({ message: 'Error deleting student' });
  }
});
```

### 6. HEAD & OPTIONS - Metadata Methods

```javascript
// HEAD - Check if a student exists (returns only headers, no body)
router.head('/:roll', (req, res) => {
  const roll = parseInt(req.params.roll);
  const data = getStudentsData();
  const student = data.students.find(s => s.roll === roll);
  
  if (!student) {
    res.status(404).end();
  } else {
    res.status(200).end();
  }
});

// OPTIONS - Return available HTTP methods for the students resource
router.options('/', (req, res) => {
  res.header('Allow', 'GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS');
  res.status(200).end();
});
```

## Testing Your API

### Step 1: Set Up Jest for Testing

Create a `tests` folder and a test file for the students API:

```bash
mkdir tests
```

### Step 2: Write Test Cases

Create a file `tests/students.test.js`:

```javascript
const request = require('supertest');
const fs = require('fs');
const path = require('path');
const app = require('../server');

// Path to test students data file
const studentsFilePath = path.join(__dirname, '..', 'data', 'students.json');
let originalData;

beforeAll(() => {
  // Backup original data
  originalData = fs.readFileSync(studentsFilePath, 'utf8');
  
  // Create test data
  const testData = {
    students: [
      {
        roll: 1,
        name: "Test Student",
        marks: [
          {
            subject: "maths",
            marks: 80
          },
          {
            subject: "science",
            marks: 85
          }
        ]
      }
    ]
  };
  
  fs.writeFileSync(studentsFilePath, JSON.stringify(testData, null, 2), 'utf8');
});

afterAll(() => {
  // Restore original data
  fs.writeFileSync(studentsFilePath, originalData, 'utf8');
});

describe('Student API Tests', () => {
  
  // Basic GET test
  test('GET /api/students should return all students', async () => {
    const response = await request(app).get('/api/students');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
  
  // Add more tests for other HTTP methods
});
```

### Step 3: Running Tests

Run your tests using:

```bash
npm test
```

### Manual Testing with Tools

Besides automated testing, you can use these tools to manually test your API:

1. **Postman**: A powerful GUI tool for API testing
2. **curl**: Command-line tool for API requests
3. **VS Code REST Client**: Extension for sending HTTP requests directly from VS Code

Example curl commands:

```bash
# GET all students
curl http://localhost:3000/api/students

# GET a specific student
curl http://localhost:3000/api/students/1

# POST a new student
curl -X POST -H "Content-Type: application/json" -d '{"name":"New Student","marks":[{"subject":"maths","marks":90}]}' http://localhost:3000/api/students

# PUT update a student
curl -X PUT -H "Content-Type: application/json" -d '{"name":"Updated Student","marks":[{"subject":"maths","marks":95}]}' http://localhost:3000/api/students/1

# PATCH partially update a student
curl -X PATCH -H "Content-Type: application/json" -d '{"name":"Patched Student"}' http://localhost:3000/api/students/1

# DELETE a student
curl -X DELETE http://localhost:3000/api/students/1
```

## Running the Server

To run your server in development mode with auto-reload:

```bash
npm run dev
```

For production:

```bash
npm start
```

## Conclusion

Congratulations! You've built a basic but complete RESTful API using Express.js. This tutorial covered:

1. Setting up an Express.js project
2. Creating API endpoints using Express Router
3. Implementing CRUD operations with different HTTP methods
4. Writing tests for API endpoints
5. Manual testing techniques

As you continue learning, consider exploring these advanced topics:

- Authentication and authorization
- Database integration (MongoDB, PostgreSQL)
- Validation middleware
- API documentation with Swagger
- Error handling middleware
- Rate limiting
- Environment configuration

Happy coding!
