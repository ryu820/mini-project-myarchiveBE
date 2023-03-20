const DetailRepository = require("../repositories/detail.repositories");

class DetailService {
  constructor() {
    this.DetailRepository = new DetailRepository();
  }

  OnesPost = async (postId) => {
    try {
      const getPost = await this.DetailRepository.OnesPost(postId);

      return getPost;
    } catch (error) {}
  };

  getComment = async (postId) => {
    try {
      const comment = await this.DetailRepository.getComment(postId);

      return comment;
    } catch (error) {}
  };

  postComment = async (postId, userId, comment) => {
    try {
      const createComment = await this.DetailRepository.postComment(
        postId,
        userId,
        comment
      );

      return createComment;
    } catch (error) {}
  };

  delComment = async (postId, userId, commentId) => {
    try {
      let comment = await Comments.findOne({ where: { commentId } });
      const delcomment = await this.DetailRepository.delComment(
        postId,
        userId,
        commentId,
        comment
      );

      return delcomment;
    } catch (error) {}
  };
}

module.exports = DetailService;
