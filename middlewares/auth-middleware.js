const jwt = require("jsonwebtoken");
const { Users,Admins } = require("../models");
require("dotenv").config();
const env = process.env;

module.exports = async (req, res, next) => {

  try {
    // const token = req.headers.authorization;
    const { token } = req.cookies;

    console.log("token : ", token);
    const [tokenType, tokendata] = (token ?? "").split(" ");
    console.log("tokendata : ", tokendata);

    if (tokenType !== "Bearer") {
      return res
        .status(401)
        .json({ message: "토큰 타입이 일치하지 않습니다." });
    }
    const decodedToken = jwt.verify(tokendata, env.SECRET_KEY);
    console.log(decodedToken);

    const accountId = decodedToken.accountId;
    let user;
    //관리자 유저일 때
    if (!decodedToken.nick){
      user = await Admins.findOne({ where: { accountId } });
    }else {
      user = await Users.findOne({ where: { accountId } });
    }

    if (!user) {
      res.clearCookie("token");
      return res
        .status(401)
        .json({ message: "토큰 사용자가 존재하지 않습니다." });
    }
    res.locals.user = user;

    next();
  } catch (error) {
    next(error)
  }
};
