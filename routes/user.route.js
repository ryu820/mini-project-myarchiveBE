const express = require("express");
const router = express.Router();

const UserController = require("../controllers/users.controllers.js")
const usercontroller = new UserController();

//회원가입 아이디 중복확인
//localhost:3017//register/check-id
router.post("/register/check-id", usercontroller.checkId);

//회원가입 닉네임 중복확인
//localhost:3017/register/check-nick
router.post("/register/check-nick", usercontroller.checkNick);

//회원가입API
//localhost:3017/register
router.post("/register", usercontroller.Register);

//로그인 API
//localhost:3017/login
router.post("/login",usercontroller.Login);


module.exports = router;