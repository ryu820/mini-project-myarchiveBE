const { Posts, Users, Comments } = require("../models");

class DetailRepository extends Comments {
  constructor() {
    super();
  }

  OnesPost = async (postId) => {
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
    return detail_posts;
  };

  getComment = async (postId) => {
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
    return comments;
  };

  postComment = async (postId, userId, comment) => {
    const comments = await Comments.create({
      userId: userId,
      postId: postId,
      comment: comment,
    });
    return comments;
  };

  delComment = async (postId, userId, commentId, comment) => {
    comment = await Comments.destroy({
      where: {
        [Op.and]: [{ postId }, { userId }, { commentId }],
      },
    });
    return comment;
  };
}

module.exports = DetailRepository;
