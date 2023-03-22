const express = require("express");
const { Admins, Users, Comments, Posts } = require("../models");
const router = express.Router();
const jwt = require("jsonwebtoken");
const CustomError = require("../middlewares/errorhandler.js");
const env = process.env;
const adminauthmiddleware = require("../middlewares/admin-auth-middleware");
const Sequelize = require("sequelize");
// const AdminController = require("../controllers/admin.controllers");
// const adminsController = new AdminController();

// //관리자 로그인 API
// //localhost:3017/admin
// router.post("/admin", adminsController.adminLogin);

// //관리자:전체유저조회API
// //localhost:3017/admin/users
// router.get("/admin/users", adminauthmiddleware,adminsController.allUsers);

// //관리자:특정유저삭제API
// //localhost:3017/admin/users/:userId
// router.delete("/admin/users/:userId",adminauthmiddleware, adminsController.delUser);

// //전체 게시글 조회
// //localhost:3017/admin/posts
// router.get("/admin/posts", adminauthmiddleware,adminsController.allPosts);

// //게시글 삭제
// //localhost:3017/admin/posts/:postId
// router.delete("/admin/posts/:postId",adminauthmiddleware, adminsController.delPost);

// //전체 댓글 조회
// //localhost:3017/admin/comments
// router.get("/admin/comments", adminauthmiddleware,adminsController.allComments);

// //댓글 삭제
// //localhost:3017/admin/comments/:commentId
// router.delete("/admin/comments/:commentId",adminauthmiddleware, adminsController.delComment);

//관리자 로그인 API
//localhost:3017/admin
router.post("/admin", async (req, res, next) => {
  const { accountId, password, secretKey } = req.body;
  try {
    const adminUser = await Admins.findOne({ where: { accountId } });
    if (!adminUser) {
      throw new CustomError("아이디가 존재하지 않습니다.", 412);
    } else if (password !== adminUser.password) {
      throw new CustomError("비밀번호가 일치하지 않습니다.", 412);
    } else if (secretKey !== adminUser.secretkey) {
      throw new CustomError("시크릿키가 일치하지 않습니다.", 412);
    }
    const token = jwt.sign({ accountId: adminUser.accountId }, env.SECRET_KEY, {
      expiresIn: "2H",
    });

    res.header("token", token); //토큰값을  body가 아닌 해더에 보내준다
    res.cookie("token", `Bearer ${token}`);
    // console.log(adminUser.nick)
    res
      .status(200)
      .json({ message: `${adminUser.nick}님이 로그인하였습니다.` });
  } catch (error) {
    next(error);
    // res.status(400).json({"errorMessage" : "뭔가 이상해유"})
  }
});

//관리자:전체유저조회API
//localhost:3017/admin/users
router.get("/admin/users", async (req, res, next) => {
  try {
    const users = await Users.findAll();
    res.status(200).json({ users: users });
  } catch (error) {
    next(error);
  }
});

//관리자:특정유저삭제API
//localhost:3017/admin/users/:userId
router.delete("/admin/users/:userId", async (req, res, next) => {
  const { userId } = req.params;
  try {
    const deleteUser = await Users.findOne({ where: { userId } });
    console.log(deleteUser.userId, userId);
    await Users.destroy({
      where: { userId: deleteUser.userId },
    });
    res.status(200).json({ message: "해당 회원을 삭제하였습니다." });
  } catch (error) {
    next(error);
  }
});

//전체 게시글 조회
router.get("/admin/posts", async (req, res, next) => {
  try {
    const posts = await Posts.findAll();

    res.status(200).json({ posts });
  } catch (error) {
    next(error);
  }
});

//게시글  삭제
router.delete("/admin/posts/:postId", async (req, res, next) => {
  try {
    const { postId } = req.params;
    const deletePost = await Posts.findOne({ where: { postId } });
    console.log(deletePost.postId, postId);
    if (!deletePost) {
      throw new CustomError("게시글이 존재하지않아유~", 404);
    }
    await Posts.destroy({
      where: { postId: deletePost.postId },
    });
    res.status(200).json({ message: "해당 게시물을 삭제하였습니다." });
  } catch (error) {
    next(error);
  }
});

// router.delete("/admin/posts/:postId", async (req, res, next) => {
//   try {
//     const { postId } = req.params;
//     const sql = "DELETE FROM Posts WHERE postId = :postId";
//     const result = await Sequelize.Query(sql, {
//       replacements: { postId },
//       type: Sequelize.QueryTypes.DELETE,
//     });
//     if (result[1] === 0) {
//       throw new CustomError("The post does not exist", 404);
//     }
//     res.status(200).json({ message: "This post has been deleted." });
//   } catch (error) {
//     next(error);
//   }
// });

//전체 댓글 조회
router.get("/admin/comments", async (req, res, next) => {
  try {
    const comments = await Comments.findAll();

    res.status(200).json({ comments });
  } catch (error) {
    next(error);
  }
});

//댓글 삭제
router.delete("/admin/comments/:commentId", async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const deleteComment = await Comments.findOne({ where: { commentId } });

    if (commentId !== deleteComment.commentId) {
      throw new CustomError("댓글이 존재하지않습니다.", 404);
    }
    await Comments.destroy({ where: { commentId } });

    res.status(200).json({ message: "댓글이 삭제되었습니다." });
  } catch (error) {
    next(error);
  }
});
module.exports = router;
