const jwt = require("jsonwebtoken");

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  try {
    // Get token from Authorization header
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided. Please log in.",
      });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET,
    );

    // Attach user data to request object
    // Map userId from token to id for consistency
    req.user = {
      id: decoded.userId,
      userId: decoded.userId,
      email: decoded.email,
    };
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired. Please log in again.",
      });
    }

    res.status(401).json({
      success: false,
      message: "Invalid token. Please log in.",
    });
  }
};

module.exports = { verifyToken };
