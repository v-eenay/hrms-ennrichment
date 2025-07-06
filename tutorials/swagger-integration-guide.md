# Swagger Integration and API Testing Tutorial

## 📚 Introduction

This tutorial covers how to integrate Swagger/OpenAPI documentation into your Node.js Express application and how to use it for comprehensive API testing directly in your browser.

## 🎯 What is Swagger?

**Swagger** (now part of OpenAPI) is a powerful framework for API documentation that allows you to:
- **Document APIs** with interactive documentation
- **Test APIs** directly in the browser
- **Generate API clients** for different programming languages
- **Validate API requests** and responses
- **Provide examples** and detailed descriptions

## 🛠️ Installation and Setup

### 1. Install Required Dependencies

```bash
npm install swagger-jsdoc swagger-ui-express
```

**Dependencies explained:**
- `swagger-jsdoc`: Generates OpenAPI specification from JSDoc comments
- `swagger-ui-express`: Serves Swagger UI interface for Express applications

### 2. Create Swagger Configuration

Create `src/config/swagger.js`:

```javascript
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'HRMS Backend API',
      version: '1.0.0',
      description: 'Human Resource Management System API',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./src/routes/*.js'] // Path to the API files
};

const specs = swaggerJSDoc(options);
export { swaggerUi, specs };
```

### 3. Integrate Swagger in Express App

Update your `src/index.js`:

```javascript
import { swaggerUi, specs } from './config/swagger.js';

// Add Swagger middleware
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "HRMS API Documentation"
}));
```

## 📝 Writing Swagger Documentation

### 1. Basic Route Documentation

Add JSDoc comments above your routes:

```javascript
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', login);
```

### 2. Schema Components

Define reusable schemas in your Swagger config:

```javascript
components: {
  schemas: {
    User: {
      type: 'object',
      required: ['firstName', 'lastName', 'email'],
      properties: {
        _id: {
          type: 'string',
          description: 'MongoDB ObjectId'
        },
        firstName: {
          type: 'string',
          example: 'John'
        },
        lastName: {
          type: 'string',
          example: 'Doe'
        },
        email: {
          type: 'string',
          format: 'email',
          example: 'john.doe@example.com'
        }
      }
    },
    Error: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: false
        },
        message: {
          type: 'string',
          example: 'Error message'
        }
      }
    }
  }
}
```

### 3. Authentication Documentation

For protected routes, add security:

```javascript
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
```

## 🧪 API Testing with Swagger UI

### 1. Accessing Swagger UI

1. Start your server: `npm run dev`
2. Open browser and go to: `http://localhost:5000/api-docs`
3. You'll see the interactive Swagger UI interface

### 2. Testing Authentication Endpoints

#### Step 1: Register a New User
1. Navigate to the **Authentication** section
2. Click on **POST /api/auth/register**
3. Click **"Try it out"**
4. Fill in the request body:
   ```json
   {
     "employeeId": "EMP001",
     "firstName": "John",
     "lastName": "Doe",
     "email": "john.doe@company.com",
     "password": "SecurePass123!",
     "position": "Software Developer",
     "role": "employee",
     "hireDate": "2024-01-15",
     "salary": 75000
   }
   ```
5. Click **"Execute"**
6. Check the response and note the returned JWT token

#### Step 2: Login
1. Click on **POST /api/auth/login**
2. Click **"Try it out"**
3. Fill in the request body:
   ```json
   {
     "email": "john.doe@company.com",
     "password": "SecurePass123!"
   }
   ```
4. Click **"Execute"**
5. Copy the JWT token from the response

#### Step 3: Authenticate Future Requests
1. Click the **"Authorize"** button at the top of the page
2. Enter: `Bearer YOUR_JWT_TOKEN` (replace with actual token)
3. Click **"Authorize"**
4. Click **"Close"**

### 3. Testing Protected Endpoints

#### Get Current User Profile
1. Navigate to **GET /api/auth/me**
2. Click **"Try it out"**
3. Click **"Execute"**
4. You should see your user profile data

#### Get All Users (Admin Required)
1. Navigate to **GET /api/users**
2. Click **"Try it out"**
3. Click **"Execute"**
4. If you're not an admin, you'll get a 403 error

### 4. Testing CRUD Operations

#### Create a Department
1. Navigate to **POST /api/departments**
2. Click **"Try it out"**
3. Fill in the request body:
   ```json
   {
     "name": "Engineering",
     "description": "Software development team",
     "budget": 1000000,
     "location": "Building A, Floor 3"
   }
   ```
4. Click **"Execute"**

#### Get All Departments
1. Navigate to **GET /api/departments**
2. Click **"Try it out"**
3. Click **"Execute"**

### 5. Testing Query Parameters

#### Filter Users by Department
1. Navigate to **GET /api/users**
2. Click **"Try it out"**
3. Fill in query parameters:
   - `department`: `60d5ecb74b24c1001f8e8b12`
   - `status`: `active`
4. Click **"Execute"**

### 6. Testing Attendance System

#### Clock In
1. Navigate to **POST /api/attendance/clock-in**
2. Click **"Try it out"**
3. Click **"Execute"** (no body required)

#### Clock Out
1. Navigate to **POST /api/attendance/clock-out**
2. Click **"Try it out"**
3. Click **"Execute"**

#### Get Attendance History
1. Navigate to **GET /api/attendance/user/{userId}**
2. Click **"Try it out"**
3. Enter your user ID
4. Click **"Execute"**

### 7. Testing Leave Management

#### Apply for Leave
1. Navigate to **POST /api/leaves/apply**
2. Click **"Try it out"**
3. Fill in the request body:
   ```json
   {
     "type": "annual",
     "startDate": "2024-02-01",
     "endDate": "2024-02-05",
     "reason": "Family vacation"
   }
   ```
4. Click **"Execute"**

#### Get Leave Applications
1. Navigate to **GET /api/leaves/user/{userId}**
2. Click **"Try it out"**
3. Enter your user ID
4. Click **"Execute"**

## 🔧 Advanced Testing Techniques

### 1. Testing Error Scenarios

#### Invalid Data Testing
- Try submitting incomplete data
- Use invalid email formats
- Test with missing required fields
- Verify proper error messages

#### Authentication Testing
- Test with expired tokens
- Test with invalid tokens
- Test accessing protected routes without authentication

### 2. Testing Different Response Codes

#### 200 (Success)
- Successful GET requests
- Successful updates

#### 201 (Created)
- Successful POST requests
- New resource creation

#### 400 (Bad Request)
- Invalid input data
- Validation errors

#### 401 (Unauthorized)
- Missing or invalid authentication
- Expired tokens

#### 403 (Forbidden)
- Insufficient permissions
- Role-based access denials

#### 404 (Not Found)
- Non-existent resources
- Invalid IDs

### 3. Testing with Different Roles

#### Admin User Testing
```json
{
  "email": "admin@company.com",
  "password": "AdminPass123!"
}
```

#### HR User Testing
```json
{
  "email": "hr@company.com",
  "password": "HRPass123!"
}
```

#### Regular Employee Testing
```json
{
  "email": "employee@company.com",
  "password": "EmpPass123!"
}
```

## 🎨 Customizing Swagger UI

### 1. Custom CSS Styling

```javascript
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .scheme-container { background: #1f2937; }
    .swagger-ui .info { margin: 20px 0; }
    .swagger-ui .info .title { color: #3b82f6; }
  `,
  customSiteTitle: "HRMS API Documentation"
}));
```

### 2. Custom Options

```javascript
swaggerOptions: {
  persistAuthorization: true,
  displayRequestDuration: true,
  docExpansion: 'none',
  filter: true,
  showRequestHeaders: true,
  tryItOutEnabled: true
}
```

## 📊 Best Practices

### 1. Documentation Standards
- **Use clear, descriptive summaries**
- **Provide realistic examples**
- **Document all possible responses**
- **Include error scenarios**
- **Use proper HTTP status codes**

### 2. Testing Workflow
1. **Start with Authentication** - Always test login/register first
2. **Test Happy Path** - Verify successful operations
3. **Test Edge Cases** - Invalid data, missing fields
4. **Test Permissions** - Role-based access control
5. **Test Error Handling** - Verify proper error responses

### 3. Organization Tips
- **Group related endpoints** with tags
- **Use consistent naming** conventions
- **Document request/response schemas**
- **Provide meaningful examples**
- **Include parameter descriptions**

## 🚀 Production Considerations

### 1. Environment-Specific Documentation

```javascript
servers: [
  {
    url: process.env.NODE_ENV === 'production' 
      ? 'https://api.yourcompany.com' 
      : 'http://localhost:5000',
    description: process.env.NODE_ENV === 'production' 
      ? 'Production server' 
      : 'Development server'
  }
]
```

### 2. Security in Production

```javascript
// Only serve Swagger in development
if (process.env.NODE_ENV !== 'production') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
}
```

### 3. Performance Optimization

```javascript
// Cache Swagger spec
const specs = swaggerJSDoc(options);

// Use compression
app.use('/api-docs', compression());
```

## 🔍 Troubleshooting

### Common Issues

1. **Swagger UI not loading**
   - Check if dependencies are installed
   - Verify route configuration
   - Check for JavaScript errors in browser console

2. **Authentication not working**
   - Ensure JWT token is properly formatted
   - Check token expiration
   - Verify bearer token format: `Bearer <token>`

3. **Schema validation errors**
   - Check required fields
   - Verify data types
   - Ensure proper schema references

4. **CORS issues**
   - Configure CORS for Swagger UI
   - Check allowed origins
   - Verify headers configuration

### Debugging Tips

1. **Enable verbose logging** in development
2. **Use browser dev tools** to inspect requests
3. **Check server logs** for error details
4. **Validate JSON** request bodies
5. **Test with different browsers**

## 🎯 Learning Objectives

By completing this tutorial, you will:
- ✅ Understand Swagger/OpenAPI fundamentals
- ✅ Know how to integrate Swagger into Express applications
- ✅ Be able to write comprehensive API documentation
- ✅ Master browser-based API testing
- ✅ Understand authentication testing workflows
- ✅ Know how to test different user roles and permissions
- ✅ Be able to customize Swagger UI appearance
- ✅ Understand production deployment considerations

## 🔗 Additional Resources

- [OpenAPI Specification](https://swagger.io/specification/)
- [Swagger UI Documentation](https://swagger.io/tools/swagger-ui/)
- [swagger-jsdoc Documentation](https://github.com/Surnet/swagger-jsdoc)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

---

**Happy Testing!** 🎉

With Swagger integrated into your HRMS project, you now have a powerful tool for both documenting and testing your API endpoints directly in the browser. This makes development faster, collaboration easier, and helps ensure your API works as expected.
