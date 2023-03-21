const UserService = require("../services/users.services.js");
const CustomError = require("../middlewares/errorhandler.js");
const { Users } = require("../models");
const env = process.env;
const jwt = require("jsonwebtoken");


class UserController {
    constructor() {
        this.UserService = new UserService();
    }

  checkId = async (req, res, next) => {
    const { accountId } = req.body;
    try {
      const checkId = await this.UserService.findById({ accountId });
      if (checkId) {
        throw new CustomError("중복된 아이디입니다.", 412);
      } else {
        return res.status(200).json({ message: "사용가능한 아이디 입니다" });
      }
    } catch (error) {
      next(error);
    }

  };

  checkNick = async (req, res, next) => {
    const { nick } = req.body;
    try {
      const checkNick = await this.UserService.findByNick({ nick });
      console.log(checkNick);
      if (checkNick) {
        throw new CustomError("중복된 닉네임입니다.", 412);
      } else {
        return res.status(200).json({ message: "사용가능한 닉네임 입니다" });
      }
    } catch (error) {
      next(error);
    }


    //account : 중복 확인, 형식확인
    //닉네임 : 중복 확인
    //비밀번호 : 형식확인 , 닉포함된비밀번호 허용X, 비밀번호 confirm 동일하지 않음(프론트와 조율해야 할 부분)
    Register = async (req, res, next) => {
        try {
            const { accountId, password, nick } = req.body;
            //아이디,비밀번호,닉네임체크
            await this.UserService.checkUser({ accountId, password, nick });
            //유저 등록
            await this.UserService.createUser({ accountId, password, nick });
            return res.status(201).json({ message: "회원가입에 성공하였습니다" });
        } catch (error) {
            next(error);
        }
    };

    Login = async (req, res, next) => {
        try {
            const { accountId, password } = req.body;
            // # 412 닉네임 또는 비밀번호 형식이 비정상적인 경우
            // {"errorMessage": "닉네임 또는 비밀번호의 형식이 비정상적입니다."}
            const user = await this.UserService.checkloginUser({
                accountId,
                password,
            });

            const token = jwt.sign(
                { accountId: user.accountId, nick: user.nick },
                env.SECRET_KEY,
                { expiresIn: "2H" }
            );

            res.header("token", token); //토큰값을  body가 아닌 해더에 보내준다
            res.cookie("token", `Bearer ${token}`);

            res.status(200).json({ nick: user.nick });
        } catch (error) {
            next(error);
        }
    };
};





module.exports = UserController;
