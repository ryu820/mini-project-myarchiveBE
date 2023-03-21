const express = require("express");
const { Admins, Users, Posts, Comments } = require("../models");
const CustomError = require("../middlewares/errorhandler");
const router = express.Router();

//관리자 로그인 API
//localhost:3017/admin
router.post("/admin", async (req, res, next) => {
  const { accountId, password, secretkey } = req.body;
  try {
    const adminUser = await Admins.findOne({ where: { accountId } });
    if (!adminUser || password !== adminUser.password) {
      throw new CustomError("아이디나 비밀번호가 틀렸슈~", 412);
    } else if (secretkey !== adminUser.secretkey) {
      throw new CustomError("시크릿키가 틀렸슈~", 412);
    }
    res.status(200).json({ message: "로그인 성공했슈~" });
  } catch (error) {
    next(error);
    // res.status(400).json({"errorMessage" : "뭔가 이상해유"})
  }
});

//관리자:전체유저조회API
//localhost:3017/admin/user
router.get("/admin/user", async (req, res, next) => {
  try {
    const posts = await Users.findAll();
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
});

//관리자:특정유저삭제API
// router.post("/admin/user", async (req, res, next) => {

// })

//전체 게시글 조회
router.get("/admin/posts", async (req, res, next) => {
  try {
    const posts = await Posts.findAll();

    res.status(200).json({ posts });
  } catch (error) {
    next(error);
    res.status(400).json({ errorMessage: "게시글 조회에 실패하였슈~" });
  }
});

//게시글  삭제
router.delete("/admin/posts/:postId", async (req, res, next) => {
  try {
    const { postId } = req.params;
    const deletePost = await Posts.findOne({ where: { postId } });
    if (postId !== deletePost.postId) {
      throw new CustomError("게시글이 존재하지않아유~", 404);
    }

    await Posts.destroy({ where: { postId } });

    res.status(200).json({ message: "게시글이 삭제되었슈~" });
  } catch (error) {
    next(error);
    res.status(400).json({ errorMessage: "게시글 삭제에 실패하였슈~" });
  }
});

//전체 댓글 조회
router.get("/admin/comments", async (req, res, next) => {
  try {
    const comments = await Comments.findAll();

    res.status(200).json({ comments });
  } catch (error) {
    next(error);
    res.status(400).json({ errorMessage: "댓글 조회에 실패하였슈~" });
  }
});

//댓글 삭제
router.delete("/admin/comments/:commentId", async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const deleteComment = await Comments.findOne({ where: { commentId } });

    if (commentId !== deleteComment.commentId) {
      throw new CustomError("댓글이 존재하지않습니다.", 404);
    }
    await Comments.destroy({ where: { commentId } });

    res.status(200).json({ message: "댓글이 삭제되었슈~" });
  } catch (error) {
    next(error);
    res.status(400).json({ errorMessage: "댓글 삭제에 실패하였슈~" });
  }
});

module.exports = router;
