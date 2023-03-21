const AdminService = require("../services/admin.services");
const CustomError = require("../middlewares/errorhandler.js");
const globalSchema = require("../middlewares/joi");
const Joi = require("joi");

const adminLoginSchema = Joi.object({
  accountId: Joi.string().required(),
  password: Joi.string().required(),
  secretKey: Joi.string().required(),
});

class AdminController {
  constructor() {
    this.AdminService = new AdminService();
  }
  adminLogin = async (req, res, next) => {
    try {
      const { accountId, password, secretKey } =
        await adminLoginSchema.validateAsync(req.body);
      console.log(accountId, password, secretKey);
      const adminUser = await this.AdminService.adminLogin(
        accountId,
        password,
        secretKey
      );
      res
        .status(200)
        .json({ message: `${adminUser.nick}님이 로그인하였습니다.` });
    } catch (error) {
      next(error);
      res.status(400).json({ errorMessage: "로그인에 실패하였습니다." });
    }
  };

  allUsers = async (req, res, next) => {
    try {
      const findUsers = await this.AdminService.allUsers();
      res.status(200).json({ users: findUsers });
    } catch (error) {
      next(error);
      res.status(200).json({ errorMessage: "유저 조회에 실패하였습니다." });
    }
  };

  delUser = async (req, res, next) => {
    try {
      const { userId } = req.params;
      const removeUser = await this.AdminService.delUser(userId);
      res.status(200).json({ message: "해당 회원을 삭제하였습니다." });
    } catch (error) {
      next(error);
      res.status(400).json({ errorMessage: "회원 삭제에 실패하였습니다." });
    }
  };

  allPosts = async (req, res, next) => {
    try {
      const allposts = await this.AdminService.allPosts({});
      res.status(200).json({ posts: allposts });
    } catch (error) {
      res.status(400).json({ errorMessage: "게시글 조회에 실패하였습니다." });
    }
  };

  delPost = async (req, res, next) => {
    try {
      const { postId } = req.params;
      const deletePost = await this.AdminService.delPost(postId);
      res.status(200).json({ message: "게시글이 삭제되었습니다." });
    } catch (error) {
      next(error);
      res.status(400).json({ errorMessage: "게시글 삭제에 실패하였습니다." });
    }
  };

  allComments = async (req, res, next) => {
    try {
      const findComments = await this.AdminService.allComments();
      res.status(200).json({ comments: findComments });
    } catch (error) {
      next(error);
      res.status(404).json({ errorMessage: "댓글이 조회에 실패하였습니다." });
    }
  };

  delComment = async (req, res, next) => {
    try {
      const { commentId } = req.params;
      const deleteComment = await this.AdminService.delComment(commentId);
      res.status(200).json({ message: "댓글이 삭제되었습니다." });
    } catch (error) {
      next(error);
      res.status(400).json({ errorMessage: "댓글 삭제에 실패하였습니다." });
    }
  };
}

module.exports = AdminController;
