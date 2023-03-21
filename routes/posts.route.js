const express = require("express");
const authmiddleware = require("../middlewares/auth-middleware");
const router = express.Router();

const PostController = require("../controllers/posts.controllers");
const postsController = new PostController();

router.get("/", postsController.getPosts);
router.post("/post", authmiddleware, postsController.createPost);
router.delete("/post/:postId", authmiddleware, postsController.delPost);


module.exports = router;
