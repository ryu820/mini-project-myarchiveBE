const express = require("express");
const authmiddleware = require("../middlewares/auth-middleware.js");
const router = express.Router();

const MypageController = require("../controllers/mypage.controllers.js")
const mypagecontroller = new MypageController();

//유저 게시글 조회API
//localhost:3017/mypage
router.get("/mypage", authmiddleware,mypagecontroller.getPost);


//유저 게시글 수정API
//localhost:3017/post/:postId
router.put("/post/:postId", authmiddleware,mypagecontroller.ModifyPost);

//위시리스트 수정API
//localhost:3017/mypage/:postId
router.put("/mypage/:postId", authmiddleware,mypagecontroller.checkWishList);


module.exports = router;
