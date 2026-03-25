const express = require("express");
const { verifyToken } = require("../middleware/auth");
const Post = require("../models/Post");

const router = express.Router();

// Create a new post (authenticated)
router.post("/", verifyToken, async (req, res) => {
  try {
    const { title, content } = req.body;

    // Validation
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
      });
    }

    if (title.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: "Title must be at least 3 characters long",
      });
    }

    if (content.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: "Content must be at least 10 characters long",
      });
    }

    // Create new post
    const post = new Post({
      title: title.trim(),
      content: content.trim(),
      author: req.user.id, // User ID from verified token
    });

    // Save post to database
    await post.save();

    // Populate author info
    await post.populate("author", "name email");

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    console.error("Create post error:", error);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages[0],
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while creating post",
    });
  }
});

// Get all posts with pagination (authenticated)
router.get("/", verifyToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Validation
    if (page < 1 || limit < 1) {
      return res.status(400).json({
        success: false,
        message: "Page and limit must be positive numbers",
      });
    }

    if (limit > 100) {
      return res.status(400).json({
        success: false,
        message: "Limit cannot exceed 100 items per page",
      });
    }

    const skip = (page - 1) * limit;

    // Get total count for pagination metadata
    const totalPosts = await Post.countDocuments();

    // Fetch posts with pagination
    const posts = await Post.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalPosts / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    res.status(200).json({
      success: true,
      message: "Posts retrieved successfully",
      data: posts,
      pagination: {
        currentPage: page,
        totalPages,
        limit,
        totalPosts,
        hasNextPage,
        hasPreviousPage,
      },
    });
  } catch (error) {
    console.error("Get posts error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching posts",
    });
  }
});

// Get user's own posts with pagination (authenticated)
router.get("/my-posts/:userId", verifyToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Validation
    if (page < 1 || limit < 1) {
      return res.status(400).json({
        success: false,
        message: "Page and limit must be positive numbers",
      });
    }

    if (limit > 100) {
      return res.status(400).json({
        success: false,
        message: "Limit cannot exceed 100 items per page",
      });
    }

    const skip = (page - 1) * limit;

    // Only allow users to fetch their own posts
    if (req.user.id !== req.params.userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: You can only view your own posts",
      });
    }

    // Get total count for pagination metadata
    const totalPosts = await Post.countDocuments({ author: req.params.userId });

    // Fetch user's posts with pagination
    const posts = await Post.find({ author: req.params.userId })
      .populate("author", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalPosts / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    res.status(200).json({
      success: true,
      message: "User posts retrieved successfully",
      data: posts,
      pagination: {
        currentPage: page,
        totalPages,
        limit,
        totalPosts,
        hasNextPage,
        hasPreviousPage,
      },
    });
  } catch (error) {
    console.error("Get user posts error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching user posts",
    });
  }
});

module.exports = router;
