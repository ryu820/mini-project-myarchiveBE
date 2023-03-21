const DetailService = require("../services/detail.services");
const CustomError = require("../middlewares/errorhandler");

class DetailController {
  constructor() {
    this.DetailService = new DetailService();
  }

  OnesPost = async (req, res, next) => {
    try {
      const { postId } = req.params;
      const detail_post = await this.DetailService.OnesPost(postId);
      res.status(200).json({ detail: detail_post });
    } catch (error) {
      next(error);
    }
  };

  getComment = async (req, res, next) => {
    try {
      const { postId } = req.params;
      const comments = await this.DetailService.getComment(postId);
      res.status(200).json({ detail: comments });
    } catch (error) {
      next(error);
    }
  };

  postComment = async (req, res, next) => {
    try {
      const { userId } = res.locals.user;
      const { postId } = req.params;
      const { comment } = req.body;

      const createComment = await this.DetailService.postComment(
        userId,
        postId,
        comment
      );
      res
        .status(201)
        .json({ createComment, message: "댓글 작성에 성공하였습니다." });
    } catch (error) {
      next(error);
    }
  };

  delComment = async (req, res, next) => {
    try {
      const { postId, commentId } = req.params;
      const { userId } = res.locals.user;

      const deleteComment = await this.DetailService.delComment(
        postId,
        commentId,
        userId
      );
      res.status(200).json({ message: "댓글 삭제에 성공하였습니다." });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = DetailController;
