const jwt = require("jsonwebtoken");
const { Admins } = require("../models");
require("dotenv").config();
const env = process.env;

module.exports = async (req, res, next) => {
  try {
    // const {authorization} = req.headers;
    const { token } = req.cookies;

    console.log("token : ", authorization);
    const [tokenType, tokendata] = (authorization ?? "").split(" ");
    console.log("tokendata : ", tokendata);

    if (tokenType !== "Bearer") {
      return res
        .status(401)
        .json({ errorMessage: "토큰 타입이 일치하지 않습니다." });
    } else if (!tokendata) {
      return res.status(401).json({ errorMessage: "토큰 데이터가 없습니다." }); //내일 배포 후 확인하기
    }
    const decodedToken = jwt.verify(tokendata, env.SECRET_KEY);
    console.log(decodedToken);

    const accountId = decodedToken.accountId;
    const user = await Admins.findOne({ where: { accountId } });

    if (!user) {
      res.clearCookie("token");
      return res
        .status(401)
        .json({ errorMessage: "토큰 사용자가 존재하지 않습니다." });
    }
    res.locals.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
