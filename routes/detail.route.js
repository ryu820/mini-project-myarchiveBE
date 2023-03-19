const express = require("express");
const authmiddleware = require("../middlewares/auth-middleware");
const CustomError = require("../middlewares/errorhandler");
const router = express.Router();
const { Posts, Comments } = require("../models");

router.get("/:postId", async (req, res) => {
  const { postId } = req.params;
  try {
    const detail_posts = await Posts.findById({ where: { postId } });
  } catch (error) {}
});

module.exports = router;
