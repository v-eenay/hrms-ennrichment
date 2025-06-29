import express from "express";
import { connectDB } from "./config/db.js";
import bookRoutes from "./routes/bookRoutes.js";
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
app.use("/books", bookRoutes);

// Root route
app.get("/", (req, res) => {
  return res.status(234).send("Hello, World!");
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
