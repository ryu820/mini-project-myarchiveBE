const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const { Users } = require('../models');

const authMiddleware = require('../middlewares/auth-middleware');

// ★회원가입
router.post('/register', async (req, res) => {
  try {
    const { accountId, password, confirm, nick } = req.body;

    
    
    
    await Users.create({ accountId, password, nick });

    return res.status(201).json({ message: '회원가입이 완료되었습니다.' });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ errorMessage: '회원가입에 실패하였습니다.' });
  }
});

//★로그인
router.post('/login', async (req, res) => {
  try {
    const { accountId, password } = req.body;

    const user = await Users.findOne({ where: { accountId } });
    if (!user) {
      return res.json('존재하지 않는 닉네임입니다');
    }

    if (user.password != password) {
      return res.json('비밀번호가 틀렸습니다');
    }

    //jwt생성
    const token = jwt.sign({ userId: user.userId }, 'secret_key');

    //쿠키발급
    res.cookie('authorization', `Bearer ${token}`);
    res.json("성공")
  } catch (err) {
    console.log(err);
  }
});


module.exports = router;
