import express from "express";
import { connectDB } from "./config/db.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import { PORT } from "./config/config.js";
import cors from "cors";
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
app.use("/employees", employeeRoutes);

// Root route
app.get("/", (req, res) => {
  return res.status(200).send("Welcome to HRMS API - Human Resource Management System");
});

// Start the server

const startServer = async () => {
  await connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
      });
    })
    .catch((error) => {
      console.error("Error starting the server:", error);
      process.exit(1);
    });
};

startServer();
