const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { Users } = require("../models");

require("dotenv").config();
const env = process.env;

//회원가입 아이디 중복확인
//localhost:3017//register/check-id
router.post("/register/check-id", async (req, res) => {
  const { accountId } = req.body;
  try {
    const checkId = await Users.findOne({ where: { accountId } });
    if (checkId) {
      return res.status(412).json({ errorMessage: "중복된 아이디입니다." });
    } else {
      return res.status(200).json({ message: "사용가능한 아이디 입니다" });
    }
  } catch (err) {
    return res.status(400).json({ errormessage: "알수없는 오류입니다." });
  }
});

//회원가입 닉네임 중복확인
//localhost:3017/register/check-nick
router.post("/register/check-nick", async (req, res) => {
  const { nick } = req.body;
  try {
    const checkNick = await Users.findOne({ where: { nick } });
    if (checkNick) {
      return res.status(412).json({ errorMessage: "중복된 닉네임입니다." });
    } else {
      return res.status(200).json({ message: "사용가능한 닉네임 입니다" });
    }
  } catch (err) {
    return res.status(400).json({ errormessage: "알수없는 오류입니다." });
  }
});

//회원가입API
//localhost:3017/register
router.post("/register", async (req, res) => {
  try {
    const { accountId, password, nick } = req.body;
    console.log(accountId, password, nick);
    // const regex = /^[a-zA-Z0-9]{4,}$/; //정규 표현식: 조건 알파벳과숫자로 이루어진 4글자 이상

    //닉네임 체크
    const checkNick = await Users.findOne({ where: { nick } });
    if (checkNick) {
      return res.status(400).json({ errorMessage: "중복된 닉네임입니다." });
    }

    //아이디 체크
    const checkId = await Users.findOne({ where: { accountId } });
    if (checkId) {
      return res.status(400).json({ errorMessage: "중복된 아이디입니다." });
    }

    // 다시한번더 확인 : 아이디 비밀번호는 정규식 사용하는걸s로
    // if (!regex.test(accountId)) {
    //   console.log(accountId + " = 형식이 일치하지 않습니다");
    //   return res
    //     .status(412)
    //     .json({ errorMessage: "닉네임의 형식이 일치하지 않습니다." });
    // }

    // if (!regex.test(password)) {
    //   console.log(password + " = 형식이 일치하지 않습니다");
    //   return res
    //     .status(412)
    //     .json({ errorMessage: "패스워드 형식이 일치하지 않습니다." });
    // }

    if (password.toString().includes(nick)) {
      return res
        .status(412)
        .json({ errorMessage: "패스워드에 닉네임이 포함되어 있습니다." });
    }

    await Users.create({ accountId, password, nick });

    return res.status(201).json({ message: "회원가입에 성공하였습니다" });
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ errorMessage: "요청한 데이터 형식이 올바르지 않습니다." });
  }
});

//로그인 API
//localhost:3017/login
router.post("/login", async (req, res) => {
  try {
    const { accountId, password } = req.body;

    // # 412 닉네임 또는 비밀번호 형식이 비정상적인 경우
    // {"errorMessage": "닉네임 또는 비밀번호의 형식이 비정상적입니다."}

    const user = await Users.findOne({ where: { accountId } });
    if (!user) {
      return res
        .status(401)
        .json({ errorMessage: "존재하지 않는 유저입니다." });
    }

    if (user.password != password) {
      return res
        .status(412)
        .json({ errorMessage: "비밀번호가 일치하지 않습니다." });
    }

    // let expires = new Date();
    // expires.setMinutes(expires.getMinutes() + 60);
    const token = jwt.sign(
      { accountId: user.accountId, nick: user.nick },
      env.SECRET_KEY);
    // res.header("token", token).send();  //토큰값을  body가 아닌 해더에 보내준다
    res.header("token", token); //토큰값을  body가 아닌 해더에 보내준다
    res.cookie("token", `Bearer ${token}`)


    res.status(200).send("완료되었습니다"); //body token 값을 보내주면 보안을 위해 삭제
  } catch (err) {
    console.log(err);
    res.status(400).json({ errorMessage: "로그인에 실패하였습니다." });
  }
});

module.exports = router;
