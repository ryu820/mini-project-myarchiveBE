const AdminRepository = require("../repositories/admin.repotiories");
const CustomError = require("../middlewares/errorhandler.js");
const { Admins, Posts, Comments, Users } = require("../models");

class AdminService {
  constructor() {
    this.AdminRepository = new AdminRepository();
  }
  adminLogin = async (accountId, password, secretKey) => {
    const loginAdmin = await this.AdminRepository.adminLogin(
      accountId,
      password,
      secretKey
    );
    return loginAdmin;
  };

  allUsers = async () => {
    const findUsers = await this.AdminRepository.allUsers();
    return findUsers;
  };

  delUser = async (userId) => {
    const findUser = await Users.findOne({ where: { userId } });
    if (!findUser) {
      throw new CustomError("유저가 존재하지 않습니다.", 404);
    }
    const deleteUser = await this.AdminRepository.delUser(userId);
    return deleteUser;
  };

  allPosts = async () => {
    const allposts = await this.AdminRepository.allPosts();
    return allposts;
  };

  delPost = async (postId) => {
    const findPost = await Posts.findOne({ where: { postId } });
    if (!findPost) {
      throw new CustomError("게시물이 존재하지 않습니다.", 404);
    }
    const deletePost = await this.AdminRepository.delPost(postId);

    return deletePost;
  };

  allComments = async () => {
    const findComments = await this.AdminRepository.allComments();
    return findComments;
  };

  delComment = async (commentId) => {
    const findComment = await Comments.findOne({ where: { commentId } });
    if (!findComment) {
      throw new CustomError("댓글이 존재하지 않습니다.", 404);
    }
    const deleteComment = await this.AdminRepository.delComment(commentId);

    return deleteComment;
  };
}

module.exports = AdminService;
