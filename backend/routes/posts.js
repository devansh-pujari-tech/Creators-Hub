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

// Get a single post by ID (authenticated)
router.get("/:postId", verifyToken, async (req, res) => {
  try {
    const { postId } = req.params;

    // Validate MongoDB ObjectId
    if (!postId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID format",
      });
    }

    const post = await Post.findById(postId).populate("author", "name email");

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Post retrieved successfully",
      post,
    });
  } catch (error) {
    console.error("Get post error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching post",
    });
  }
});

// Update a post (only post owner can update) - authenticated
router.put("/:postId", verifyToken, async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, content } = req.body;

    // Validate MongoDB ObjectId
    if (!postId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID format",
      });
    }

    // Validation
    if (!title && !content) {
      return res.status(400).json({
        success: false,
        message: "At least title or content must be provided",
      });
    }

    if (title && title.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: "Title must be at least 3 characters long",
      });
    }

    if (content && content.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: "Content must be at least 10 characters long",
      });
    }

    // Fetch the post
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Check ownership
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: You can only edit your own posts",
      });
    }

    // Update post fields
    if (title) {
      post.title = title.trim();
    }
    if (content) {
      post.content = content.trim();
    }

    // Update the updatedAt timestamp
    post.updatedAt = Date.now();

    // Save updated post
    await post.save();

    // Populate author info
    await post.populate("author", "name email");

    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      post,
    });
  } catch (error) {
    console.error("Update post error:", error);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages[0],
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while updating post",
    });
  }
});

// Delete a post (only post owner can delete) - authenticated
router.delete("/:postId", verifyToken, async (req, res) => {
  try {
    const { postId } = req.params;

    // Validate MongoDB ObjectId
    if (!postId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID format",
      });
    }

    // Fetch the post
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Check ownership
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: You can only delete your own posts",
      });
    }

    // Delete the post
    await Post.findByIdAndDelete(postId);

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Delete post error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting post",
    });
  }
});

module.exports = router;
