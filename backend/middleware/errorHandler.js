// Global Error Handling Middleware
const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  console.error("Error occurred:", {
    message: err.message,
    status: err.status || 500,
    path: req.path,
    method: req.method,
  });

  // Default error values
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Send consistent error response
  res.status(status).json({
    success: false,
    message: message,
  });
};

module.exports = { errorHandler };
