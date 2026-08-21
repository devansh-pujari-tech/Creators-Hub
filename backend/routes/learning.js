const express = require("express");
const { verifyToken } = require("../middleware/auth");
const { asyncHandler } = require("../utils/asyncHandler");
const { generatePostDraft } = require("../services/gemini");
const { query } = require("../services/postgres");

const router = express.Router();

router.post(
  "/ai/draft",
  verifyToken,
  asyncHandler(async (req, res) => {
    const { topic, audience, tone } = req.body;
    if (!topic || topic.trim().length < 3) {
      return res
        .status(400)
        .json({
          success: false,
          message: "A topic of at least 3 characters is required",
        });
    }

    const draft = await generatePostDraft({
      topic: topic.trim(),
      audience: audience?.trim(),
      tone: tone?.trim(),
    });

    res.json({ success: true, draft });
  }),
);

router.get(
  "/sql/posts-with-authors",
  verifyToken,
  asyncHandler(async (req, res) => {
    const result = await query(`
      SELECT posts.id, posts.title, authors.name AS author_name
      FROM posts
      INNER JOIN authors ON authors.id = posts.author_id
      ORDER BY posts.created_at DESC
    `);
    res.json({ success: true, rows: result.rows });
  }),
);

module.exports = router;
