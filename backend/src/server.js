import express from "express";
import { connectDB } from "./config/db.js";
import { PORT } from "./config/config.js";
import cors from "cors";
import dotenv from "dotenv";

// Import centralized route system
import { registerRoutes, validateRoutes } from "./routes/index.js";

// Import Swagger
import { swaggerUi, specs } from "./config/swagger.js";

// Import professional logger
import logger from "./utils/logger.js";

// Configure environment variables
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
  // Log error using professional logger
  logger.error('Server error occurred', err);

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
 * Start the server with elegant logging and error handling
 */
const startServer = async () => {
  let dbConnected = false;
  let routeCount = 0;

  try {
    // Database connection
    try {
      await connectDB();
      dbConnected = true;
    } catch (dbError) {
      logger.warn('Database unavailable - server will run with limited functionality');
    }

    // Register routes
    routeCount = await registerRoutes(app);
    validateRoutes(app);

    // Start the server
    app.listen(PORT, () => {
      // Display elegant startup summary
      logger.logStartupSummary({
        port: PORT,
        dbConnected,
        routeCount: routeCount || 6, // Default route count
        environment: process.env.NODE_ENV || 'development'
      });
    });

  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
};

startServer();
