const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { Users } = require("../models");
require("dotenv").config();
const env = process.env;

//★ 회원가입 아이디 중복확인
router.post("/register/check-id", async (req, res) => {
  const { accountId } = req.body;
  const checkId = await Users.findOne({ where: { accountId } });

  if (checkId) {
    return res.status(400).json({ data: "중복된 아이디 입니다" });
  }

  res.status(200).json({ data: "사용가능한 아이디 입니다" });
});

//★ 회원가입 닉네임 중복확인
router.post("/register/check-nick", async (req, res) => {
  const { nick } = req.body;
  const checkNick = await Users.findOne({ where: { nick } });

  if (checkNick) {
    return res.status(400).json({ data: "중복된 닉네임 입니다" });
  }
  res.status(200).json({ data: "사용가능한 닉네임 입니다" });
});

// ★회원가입
router.post("/register", async (req, res) => {
  try {
    const { accountId, password, confirm, nick } = req.body;
    const regex = /^[a-z0-9]{4,}$/;

    if (!regex.test(accountId)) {
      console.log(accountId + " = 형식이 일치하지 않습니다");
      res
        .status(412)
        .json({ errorMessage: "닉네임의 형식이 일치하지 않습니다." });
    } else if (password.includes(nick)) {
      res
        .status(412)
        .json({ errorMessage: "패스워드에 닉네임이 포함되어 있습니다." });
    } else {
      console.log(accountId + " = 형식이 일치");
    }

    // # 412 password가 일치하지 않는 경우
    // {"errorMessage": "패스워드가 일치하지 않습니다."}
    // # 412 password 형식이 비정상적인 경우
    // {"errorMessage": "패스워드 형식이 일치하지 않습니다.}
    // # 412 password에 닉네임이 포함되어있는 경우
    // {"errorMessage": "패스워드에 닉네임이 포함되어 있습니다."}
    // # 412 닉네임이 중복된 경우
    // {"errorMessage": "중복된 닉네임입니다."}
    // # 400 예외 케이스에서 처리하지 못한 에러
    // {"errorMessage": "요청한 데이터 형식이 올바르지 않습니다."}

    // return res.send();
    await Users.create({ accountId, password, nick });
    return res.status(201).json({ message: "회원가입이 완료되었습니다." });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      errorMessage: "회원가입에 요청한 데이터 형식이 올바르지 않습니다..",
    });
  }
});

//★로그인
router.post("/login", async (req, res) => {
  try {
    const { accountId, password } = req.body;

    const user = await Users.findOne({ where: { accountId } });
    if (!user) {
      return res.json("닉네임 또는 패스워드를 확인 해주세요(닉네임)");
    }

    if (user.password != password) {
      return res.json("닉네임 또는 패스워드를 확인 해주세요(비밀번호)");
    }

    //jwt생성
    const token = jwt.sign({ userId: user.userId }, env.SECRET_KEY);

    //쿠키발급
    res.cookie("authorization", `Bearer ${token}`);
    res.status(200).json({ token });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
