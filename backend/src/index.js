import express from "express";
import { connectDB } from "./config/db.js";
import { PORT } from "./config/config.js";
import cors from "cors";
import dotenv from "dotenv";

// Import centralized route system
import { registerRoutes, validateRoutes } from "./routes/index.js";

// Import Swagger
import { swaggerUi, specs } from "./config/swagger.js";

dotenv.config();

// Create an Express application
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to handle Cross-Origin Resource Sharing (CORS)
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .scheme-container { background: #1f2937; padding: 20px; }
  `,
  customSiteTitle: "HRMS API Documentation",
  customfavIcon: "/favicon.ico",
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    docExpansion: 'none',
    filter: true,
    showRequestHeaders: true,
    tryItOutEnabled: true
  }
}));

// Root route
app.get("/", (req, res) => {
  return res.status(200).json({
    message: "Welcome to HRMS API - Human Resource Management System",
    documentation: "Visit /api-docs for API documentation",
    version: "1.0.0",
    endpoints: {
      docs: "/api-docs",
      health: "/health",
      auth: "/api/auth",
      users: "/api/users",
      departments: "/api/departments",
      attendance: "/api/attendance",
      leaves: "/api/leaves",
      payroll: "/api/payroll"
    }
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  // Log error details in development mode only
  if (process.env.NODE_ENV === 'development') {
    console.error('Error details:', err.stack);
  }

  // Send appropriate error response
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

/**
 * Start the server with proper error handling and logging
 */
const startServer = async () => {
  try {
    // Try to connect to database, but don't fail if it's not available
    try {
      await connectDB();
      if (process.env.NODE_ENV !== 'test') {
        console.log('✅ Database connected successfully');
      }
    } catch (dbError) {
      if (process.env.NODE_ENV !== 'test') {
        console.warn('⚠️  Database connection failed, but continuing to start server:', dbError.message);
        console.log('🔄 Server will run without database functionality');
      }
    }

    // Register all routes dynamically
    await registerRoutes(app);

    // Validate route registration
    validateRoutes(app);

    // Start the server
    app.listen(PORT, () => {
      if (process.env.NODE_ENV !== 'test') {
        console.log(`🚀 Server is running on http://localhost:${PORT}`);
        console.log(`📚 API Documentation available at http://localhost:${PORT}/api-docs`);
        console.log(`🏥 Health check available at http://localhost:${PORT}/health`);
        console.log(`📁 Root API endpoint: http://localhost:${PORT}/api`);
      }
    });

  } catch (error) {
    console.error("💥 Error starting the server:", error);
    process.exit(1);
  }
};

startServer();
