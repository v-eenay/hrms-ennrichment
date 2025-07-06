import express from "express";
import { connectDB } from "./config/db.js";
import { PORT } from "./config/config.js";
import cors from "cors";

// Import Swagger
import { swaggerUi, specs } from "./config/swagger.js";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js";
import payrollRoutes from "./routes/payrollRoutes.js";

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

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/payroll", payrollRoutes);

// Swagger Documentation (temporarily disabled for debugging)
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
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start the server
const startServer = async () => {
  await connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`🚀 Server is running on http://localhost:${PORT}`);
        console.log(`📚 API Documentation available at http://localhost:${PORT}/api-docs`);
        console.log(`🏥 Health check available at http://localhost:${PORT}/health`);
      });
    })
    .catch((error) => {
      console.error("Error starting the server:", error);
      process.exit(1);
    });
};

startServer();
