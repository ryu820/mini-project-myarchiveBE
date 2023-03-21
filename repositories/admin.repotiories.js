const { Admins, Users, Comments, Posts } = require("../models");
const CustomError = require("../middlewares/errorhandler.js");

class AdminRepository extends Admins {
  constructor() {
    super();
  }
  adminLogin = async (accountId, password, secretKey) => {
    console.log(accountId, password, secretKey);
    const adminUser = await Admins.findOne({ where: { accountId } });
    if (!adminUser) {
      throw new CustomError("아이디가 존재하지 않습니다.", 412);
    } else if (password !== adminUser.password) {
      throw new CustomError("비밀번호가 일치하지 않습니다.", 412);
    } else if (secretKey !== adminUser.secretkey) {
      throw new CustomError("시크릿키가 일치하지 않습니다.", 412);
    }
    return adminUser;
  };

  allUsers = async () => {
    const findUsers = await Users.findAll({});
    return findUsers;
  };

  delUser = async (userId) => {
    const deleteUser = await Users.destroy({ where: { userId } });
    return deleteUser;
  };

  allPosts = async () => {
    const allposts = await Posts.findAll();
    return allposts;
  };

  delPost = async (postId) => {
    const deletePost = await Posts.destroy({ where: { postId } });
    return deletePost;
  };

  allComments = async () => {
    const findComments = await Comments.findAll();
    return findComments;
  };

  delComment = async (commentId) => {
    const deleteComment = await Comments.destroy({ where: { commentId } });
    return deleteComment;
  };
}

module.exports = AdminRepository;
