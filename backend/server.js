const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/database");
const userRoutes = require("./routes/users");
const postRoutes = require("./routes/posts");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// CORS configuration
const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

// Test API endpoint
app.get("/api/test", (req, res) => {
  res.json({
    message: "Backend is connected!",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global Error Handling Middleware (MUST be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
