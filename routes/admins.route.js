const express = require("express");
const router = express.Router();
const adminauthmiddleware = require("../middlewares/admin-auth-middleware");
const AdminController = require("../controllers/admin.controllers");
const adminsController = new AdminController();

//관리자 로그인 API
//localhost:3017/admin
router.post("/admin", adminsController.adminLogin);

//관리자:전체유저조회API
//localhost:3017/admin/users
router.get("/admin/users", adminauthmiddleware,adminsController.allUsers);

//관리자:특정유저삭제API
//localhost:3017/admin/users/:userId
router.delete("/admin/users/:userId",adminauthmiddleware, adminsController.delUser);

//전체 게시글 조회
//localhost:3017/admin/posts
router.get("/admin/posts", adminauthmiddleware,adminsController.allPosts);

//게시글 삭제
//localhost:3017/admin/posts/:postId
router.delete("/admin/posts/:postId",adminauthmiddleware, adminsController.delPost);

//전체 댓글 조회
//localhost:3017/admin/comments
router.get("/admin/comments", adminauthmiddleware,adminsController.allComments);

//댓글 삭제
//localhost:3017/admin/comments/:commentId
router.delete("/admin/comments/:commentId",adminauthmiddleware, adminsController.delComment);

module.exports = router;
