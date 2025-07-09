import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'HRMS Backend API',
      version: '1.0.0',
      description: 'A comprehensive Human Resource Management System API built with Node.js, Express.js, and MongoDB',
      contact: {
        name: 'HRMS Development Team',
        email: 'support@hrms.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      },
      {
        url: 'https://your-production-url.com',
        description: 'Production server'
      }
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and profile management'
      },
      {
        name: 'Users',
        description: 'User management operations'
      },
      {
        name: 'Departments',
        description: 'Department management operations'
      },
      {
        name: 'Attendance',
        description: 'Employee attendance tracking'
      },
      {
        name: 'Leaves',
        description: 'Leave application and management'
      },
      {
        name: 'Payroll',
        description: 'Payroll and salary management'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token in Authorization header'
        },
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'jwt',
          description: 'JWT token stored in HTTP-only cookie'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            _id: {
              type: 'string',
              description: 'MongoDB ObjectId'
            },
            name: {
              type: 'string',
              description: 'Full name of the user',
              minLength: 2,
              maxLength: 50
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address (unique)'
            },
            password: {
              type: 'string',
              description: 'User password (hashed)',
              minLength: 6
            },
            role: {
              type: 'string',
              enum: ['admin', 'manager', 'employee'],
              default: 'employee',
              description: 'User role'
            },
            department: {
              type: 'string',
              description: 'Department ObjectId reference'
            },
            designation: {
              type: 'string',
              description: 'Job designation/title'
            },
            salary: {
              type: 'number',
              minimum: 0,
              description: 'User salary'
            },
            profileImage: {
              type: 'string',
              description: 'Profile image URL'
            },
            phoneNumber: {
              type: 'string',
              pattern: '^\\d{10,15}$',
              description: 'Phone number (10-15 digits)'
            },
            address: {
              type: 'string',
              description: 'User address'
            },
            dateOfJoining: {
              type: 'string',
              format: 'date-time',
              description: 'Date when user joined'
            },
            isActive: {
              type: 'boolean',
              default: true,
              description: 'Account active status'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Record creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Record last update timestamp'
            }
          }
        },
        Department: {
          type: 'object',
          required: ['name'],
          properties: {
            _id: {
              type: 'string',
              description: 'MongoDB ObjectId'
            },
            name: {
              type: 'string',
              description: 'Department name (unique)'
            },
            description: {
              type: 'string',
              description: 'Department description'
            },
            head: {
              type: 'string',
              description: 'Department head ObjectId reference'
            },
            budget: {
              type: 'number',
              minimum: 0,
              description: 'Department budget'
            },
            isActive: {
              type: 'boolean',
              default: true,
              description: 'Department active status'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Record creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Record last update timestamp'
            }
          }
        },
        Attendance: {
          type: 'object',
          required: ['userId', 'date'],
          properties: {
            _id: {
              type: 'string',
              description: 'MongoDB ObjectId'
            },
            userId: {
              type: 'string',
              description: 'User ObjectId reference'
            },
            date: {
              type: 'string',
              format: 'date',
              description: 'Attendance date'
            },
            clockIn: {
              type: 'string',
              format: 'date-time',
              description: 'Clock in time'
            },
            clockOut: {
              type: 'string',
              format: 'date-time',
              description: 'Clock out time'
            },
            totalHours: {
              type: 'number',
              default: 0,
              description: 'Total hours worked'
            },
            status: {
              type: 'string',
              enum: ['present', 'absent', 'half-day', 'leave'],
              default: 'absent',
              description: 'Attendance status'
            },
            notes: {
              type: 'string',
              description: 'Additional notes'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Record creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Record last update timestamp'
            }
          }
        },
        Leave: {
          type: 'object',
          required: ['userId', 'type', 'dateFrom', 'dateTo', 'totalDays', 'reason'],
          properties: {
            _id: {
              type: 'string',
              description: 'MongoDB ObjectId'
            },
            userId: {
              type: 'string',
              description: 'User ObjectId reference'
            },
            type: {
              type: 'string',
              enum: ['sick', 'casual', 'earned', 'maternity', 'paternity'],
              description: 'Leave type'
            },
            dateFrom: {
              type: 'string',
              format: 'date',
              description: 'Leave start date'
            },
            dateTo: {
              type: 'string',
              format: 'date',
              description: 'Leave end date'
            },
            totalDays: {
              type: 'number',
              description: 'Number of leave days'
            },
            reason: {
              type: 'string',
              description: 'Leave reason'
            },
            status: {
              type: 'string',
              enum: ['pending', 'approved', 'rejected'],
              default: 'pending',
              description: 'Leave status'
            },
            approvedBy: {
              type: 'string',
              description: 'Approver ObjectId reference'
            },
            appliedDate: {
              type: 'string',
              format: 'date-time',
              description: 'Application date'
            },
            responseDate: {
              type: 'string',
              format: 'date-time',
              description: 'Response date'
            },
            notes: {
              type: 'string',
              description: 'Additional notes'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Record creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Record last update timestamp'
            }
          }
        },
        Payroll: {
          type: 'object',
          required: ['userId', 'month', 'year', 'basicSalary'],
          properties: {
            _id: {
              type: 'string',
              description: 'MongoDB ObjectId'
            },
            userId: {
              type: 'string',
              description: 'User ObjectId reference'
            },
            month: {
              type: 'string',
              pattern: '^(0[1-9]|1[0-2])$',
              description: 'Payroll month (01-12)'
            },
            year: {
              type: 'number',
              minimum: 2020,
              description: 'Payroll year'
            },
            basicSalary: {
              type: 'number',
              minimum: 0,
              description: 'Basic salary amount'
            },
            allowances: {
              type: 'object',
              properties: {
                houseRent: { type: 'number', default: 0 },
                transport: { type: 'number', default: 0 },
                medical: { type: 'number', default: 0 },
                other: { type: 'number', default: 0 }
              },
              description: 'Allowances breakdown'
            },
            deductions: {
              type: 'object',
              properties: {
                tax: { type: 'number', default: 0 },
                providentFund: { type: 'number', default: 0 },
                insurance: { type: 'number', default: 0 },
                other: { type: 'number', default: 0 }
              },
              description: 'Deductions breakdown'
            },
            totalAllowances: {
              type: 'number',
              default: 0,
              description: 'Total allowances amount'
            },
            totalDeductions: {
              type: 'number',
              default: 0,
              description: 'Total deductions amount'
            },
            grossSalary: {
              type: 'number',
              default: 0,
              description: 'Gross salary (calculated)'
            },
            netSalary: {
              type: 'number',
              default: 0,
              description: 'Net salary (calculated)'
            },
            payDate: {
              type: 'string',
              format: 'date',
              description: 'Payment date'
            },
            status: {
              type: 'string',
              enum: ['pending', 'paid', 'cancelled'],
              default: 'pending',
              description: 'Payroll status'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Record creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Record last update timestamp'
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
              description: 'Error message'
            },
            error: {
              type: 'string',
              description: 'Error details'
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              description: 'Success message'
            },
            data: {
              type: 'object',
              description: 'Response data'
            }
          }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Login successful'
            },
            data: {
              type: 'object',
              properties: {
                _id: {
                  type: 'string',
                  example: '60d5ecb74b24c1001f8e8b12'
                },
                name: {
                  type: 'string',
                  example: 'John Doe'
                },
                email: {
                  type: 'string',
                  example: 'john.doe@company.com'
                },
                role: {
                  type: 'string',
                  example: 'employee'
                },
                department: {
                  $ref: '#/components/schemas/Department'
                },
                token: {
                  type: 'string',
                  example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                },
                cookieSet: {
                  type: 'boolean',
                  example: true,
                  description: 'Indicates if JWT cookie was set'
                },
                cookieInfo: {
                  type: 'object',
                  properties: {
                    environment: {
                      type: 'string',
                      example: 'development'
                    },
                    httpOnly: {
                      type: 'boolean',
                      example: true
                    },
                    secure: {
                      type: 'boolean',
                      example: false
                    },
                    sameSite: {
                      type: 'string',
                      example: 'lax'
                    },
                    maxAgeDays: {
                      type: 'number',
                      example: 7
                    }
                  }
                }
              }
            }
          }
        },
        RegisterResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'User registered successfully'
            },
            data: {
              type: 'object',
              properties: {
                _id: {
                  type: 'string',
                  example: '60d5ecb74b24c1001f8e8b12'
                },
                name: {
                  type: 'string',
                  example: 'John Doe'
                },
                email: {
                  type: 'string',
                  example: 'john.doe@company.com'
                },
                role: {
                  type: 'string',
                  example: 'employee'
                },
                token: {
                  type: 'string',
                  example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                }
              }
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [
    './src/routes/*.js',
    './src/controllers/*.js',
    './src/models/*.js'
  ]
};

const specs = swaggerJSDoc(options);

export { swaggerUi, specs };
