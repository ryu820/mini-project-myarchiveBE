const DetailRepository = require("../repositories/detail.repositories");
const CustomError = require("../middlewares/errorhandler");
const { Comments } = require("../models");

class DetailService {
  constructor() {
    this.DetailRepository = new DetailRepository();
  }

  OnesPost = async (postId) => {
    const getPost = await this.DetailRepository.OnesPost(postId);

    return getPost;
  };

  getComment = async (postId) => {
    const comment = await this.DetailRepository.getComment(postId);

    return comment;
  };

  postComment = async (postId, userId, comment) => {
    const createComment = await this.DetailRepository.postComment(
      postId,
      userId,
      comment
    );

    return createComment;
  };

  delComment = async (postId, userId, commentId) => {
    let comment = await Comments.findOne({ where: { commentId } });
    const delcomment = await this.DetailRepository.delComment(
      postId,
      userId,
      commentId,
      comment
    );

    return delcomment;
  };
}

module.exports = DetailService;
