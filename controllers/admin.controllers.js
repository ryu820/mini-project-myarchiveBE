const AdminService = require("../services/admin.services");
const globalSchema = require("../middlewares/joi");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const env = process.env;

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
      
      const token = jwt.sign(
        { accountId: adminUser.accountId },
        env.SECRET_KEY,
        { expiresIn: "2H" }
      );

      res.header("token", token); //토큰값을  body가 아닌 해더에 보내준다
      res.cookie("token", `Bearer ${token}`);
      res
        .status(200)
        .json({ message: `${adminUser.nick}님이 로그인하였습니다.` });
    } catch (error) {
      next(error);
    }
  };

  allUsers = async (req, res, next) => {
    try {
      const findUsers = await this.AdminService.allUsers();
      res.status(200).json({ users: findUsers });
    } catch (error) {
      next(error);
    }
  };

  delUser = async (req, res, next) => {
    try {
      const { userId } = req.params;
      const removeUser = await this.AdminService.delUser(userId);
      res.status(200).json({ message: "해당 회원을 삭제하였습니다." });
    } catch (error) {
      next(error);
    }
  };

  allPosts = async (req, res, next) => {
    try {
      const allposts = await this.AdminService.allPosts({});
      res.status(200).json({ posts: allposts });
    } catch (error) {
      next(error)
    }
  };

  delPost = async (req, res, next) => {
    try {
      const { postId } = req.params;
      const deletePost = await this.AdminService.delPost(postId);
      res.status(200).json({ message: "게시글이 삭제되었습니다." });
    } catch (error) {
      next(error);
    }
  };

  allComments = async (req, res, next) => {
    try {
      const findComments = await this.AdminService.allComments();
      res.status(200).json({ comments: findComments });
    } catch (error) {
      next(error);
    }
  };

  delComment = async (req, res, next) => {
    try {
      const { commentId } = req.params;
      const deleteComment = await this.AdminService.delComment(commentId);
      res.status(200).json({ message: "댓글이 삭제되었습니다." });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = AdminController;
