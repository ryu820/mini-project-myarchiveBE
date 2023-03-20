const jwt = require("jsonwebtoken");
const { Users } = require("../models");
require("dotenv").config();
const env = process.env;

module.exports = async (req, res, next) => {
  // try {
  // const token = req.headers.authorization;
  const { token } = req.cookies;
  console.log("token : ", token);
  const [tokenType, tokendata] = (token ?? "").split(" ");
  console.log("tokendata : ", tokendata);

  if (tokenType !== "Bearer") {
    return res.status(401).json({ message: "토큰 타입이 일치하지 않습니다." });
  }
  const decodedToken = jwt.verify(tokendata, env.SECRET_KEY);
  console.log(decodedToken);
  // const decodedToken = jwt.verify(token, env.SECRET_KEY, (error,decoded) => {
  //     const currentTime = Math.floor(Date.now() / 1000);
  //     if (decoded.exp && decoded.exp < currentTime) {
  //         console.log("만료되었다 이놈아")
  //     }
  // });

  const accountId = decodedToken.accountId;

  const user = await Users.findOne({ where: { accountId } });

  if (!user) {
    res.clearCookie("token");
    return res
      .status(401)
      .json({ message: "토큰 사용자가 존재하지 않습니다." });
  }
  res.locals.user = user;

  next();
  // } catch (error) {
  //     res.clearCookie("authorization");
  //     return res.status(401).json({
  //         message: "비정상적인 요청입니다.",
  //     });
  // }
};
