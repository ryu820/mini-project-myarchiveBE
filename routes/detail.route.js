const express = require("express");
const authmiddleware = require("../middlewares/auth-middleware");
const CustomError = require("../middlewares/errorhandler");
const router = express.Router();
const { Posts, Comments, Users } = require("../models");
const { Op } = require("sequelize");

//게시물 단일조회
//localhost:3017/post/:postId
router.get("/:postId", async (req, res, next) => {
  const { postId } = req.params;
  try {
    const detail_posts = await Posts.findOne({
      where: { postId },
      attributes: [
        "postId",
        "User.accountId",
        "User.nick",
        "url",
        "img",
        "category",
        "title",
        "desc",
        "isDone",
      ],
      raw: true,
      include: [
        {
          model: Users,
          attributes: [],
        },
      ],
    });
    res.status(200).json({ detail: detail_posts });
  } catch (error) {
    next(error);
    res.status(400).json({ errorMessage: "게시글 조회에 실패하였습니다." });
  }
});

//게시물 별 댓글조회
//localhost:3017/post/:postId/comments
router.get("/:postId/comments", async (req, res, next) => {
  try {
    const { postId } = req.params;
    const comments = await Comments.findAll({
      where: { postId },
      attributes: ["commentId", "postId", "User.nick", "comment"],
      raw: true,
      include: [
        {
          model: Users,
          attributes: [],
        },
      ],
    });
    if (!comments) {
      throw new CustomError("게시글이 존재하지 않습니다.", 404);
    }
    res.status(200).json({ detail: comments });
  } catch (error) {
    next(error);
    res.status(400).json({ errorMessage: "댓글 조회에 실패하였습니다." });
  }
});

//게시물 별 댓글 작성
//localhost:3017/post/:postId/comments
router.post("/:postId/comments", authmiddleware, async (req, res, next) => {
  try {
    const { userId } = res.locals.user;
    const { postId } = req.params;
    const { comment } = req.body;

    if (!comment) {
      throw new CustomError("comment를 입력해주세요", 410);
    }
    if (Number(comment.length > 100 || typeof comment !== "string")) {
      throw new CustomError("글자 수를 초과하였습니다.", 412);
    }
    const now = new Date();
    const comments = await Comments.create({
      userId: userId,
      postId: postId,
      comment: comment,
      createdAt: now,
      updatedAt: now,
    });

    res.status(201).json({ comments, message: "댓글 작성에 성공하였습니다." });
  } catch (error) {
    next(error);
    res.status(401).json({ errorMessage: "댓글 작성에 실패하였습니다." });
  }
});

//댓글 삭제
//localhost:3017/post/:postId/comments/:commentId
router.delete(
  "/:postId/comments/:commentId",
  authmiddleware,
  async (req, res, next) => {
    try {
      const { postId, commentId } = req.params;
      const { userId } = res.locals.user;

      let comment = await Comments.findOne({ where: { commentId } });
      console.log(comment);
      if (!comment || comment === null) {
        throw new CustomError("댓글이 존재하지 않습니다.", 404);
      }
      if (!postId) {
        throw new CustomError("댓글이 존재하지 않습니다1.", 404);
      } else if (comment.userId !== userId) {
        throw new CustomError("댓글의 삭제권한이 존재하지 않습니다.", 403);
      }
      comment = await Comments.destroy({
        where: {
          [Op.and]: [{ postId }, { userId }, { commentId }],
        },
      });

      return res.status(200).json({ message: "댓글 삭제에 성공하였습니다." });
    } catch (error) {
      next(error);
      res
        .status(401)
        .json({ errorMessage: "댓글이 정상적으로 삭제되지 않았습니다." });
    }
  }
);

module.exports = router;
