const jwt = require('jsonwebtoken');
const { Users } = require('../models');
require("dotenv").config();
const env = process.env

module.exports = async (req, res, next) => {
  try {
    const { authorization } = req.cookies;
    const [tokenType, token] = authorization.split(' ');

    if (tokenType !== 'Bearer') {
      return res
        .status(401)
        .json({ errorMessage: `tokenType이 올바르지 않습니다. (보낸 type은 ${tokenType}입니다.)` });
    }

    const decodedToken = jwt.verify(token, env.SECRET_KEY);

    const userId = decodedToken.userId;

    const user = await Users.findOne({ where: { userId } });

    if (!user) {
      res.clearCookie('authorization');
      return res
        .status(401)
        .json({ message: '토큰 사용자가 존재하지 않습니다.' });
    }
    res.locals.user = user;

    return next();  

  } catch (error) {
    res.clearCookie('authorization');
    return res
      .status(401)
      .json({ message: '비정상적인 요청입니다.'});
  }
};
 

// # 403 Cookie가 존재하지 않을 경우
// {"errorMessage": "로그인이 필요한 기능입니다."}

// # 403 Cookie가 비정상적이거나 만료된 경우
// {"errorMessage": "전달된 쿠키에서 오류가 발생하였습니다."}

// #401 authorization 정보가 존재하지 않을 경우
// {"errorMessage":header에 authorization 정보가 존재하지 않습니다.}

// #401 token value가 존재하지 않을 경우
// {"errorMessage":token value가 존재하지 않습니다.}