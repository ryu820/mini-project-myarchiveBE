const express = require("express");
const authmiddleware = require("../middlewares/auth-middleware");
const CustomError = require("../middlewares/errorhandler");
const router = express.Router();
const { Posts, Comments, Users } = require("../models");
const { Op } = require("sequelize");

//게시물 단일조회
//localhost:3017/post/:postId
router.get("/:postId", async (req, res) => {
  const { postId } = req.params;
  //   try {
  const detail_posts = await Posts.findOne({
    where: { postId },
    attributes: ["postId", "userId", "title", "desc"],
  });
  res.status(200).json({ detail: detail_posts });
  //   } catch (error) {}
});

//게시물 별 댓글조회
//localhost:3017/post/:postId/comments
router.get("/:postId/comments", async (req, res) => {
  const { postId } = req.params;
  //try{
  const comments = await Comments.findOne({
    where: { postId },
    attributes: [
      "commentId",
      "postId",
      "User.nick",
      "comment",
      "createdAt",
      "updatedAt",
    ],
    raw: true,
    include: [
      {
        model: Users,
        attributes: [],
      },
    ],
  });
  res.status(200).json({ comments });
  //   }catch(error) {

  //   }
});

//게시물 별 댓글 작성
//localhost:3017/post/:postId/comments
router.post("/:postId/comments", authmiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const { postId } = req.params;
  const { comment } = req.body;

  const now = new Date();
  const comments = await Comments.create({
    userId: userId,
    postId: postId,
    comment: comment,
    createdAt: now,
    updatedAt: now,
  });
  res.status(200).json({ comments, message: "댓글 작성에 성공하였습니다." });
});

//댓글 삭제
//localhost:3017/post/:postId/comments/:commentId
router.delete(
  "/:postId/comments/:commentId",
  authmiddleware,
  async (req, res) => {
    const { postId, commentId } = req.params;
    const { userId } = res.locals.user;

    await Comments.destroy({
      where: {
        [Op.and]: [{ postId }, { userId }, { commentId }],
      },
    });
    return res.status(200).json({ message: "댓글 삭제에 성공하였습니다." });
  }
);

module.exports = router;
