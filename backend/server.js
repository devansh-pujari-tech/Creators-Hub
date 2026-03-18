const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/database");
const userRoutes = require("./routes/users");

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

// Test API endpoint
app.get("/api/test", (req, res) => {
  res.json({
    message: "Backend is connected!",
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
