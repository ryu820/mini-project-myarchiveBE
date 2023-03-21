const express = require("express");
const { Admins, Users, Posts } = require("../models");
const CustomError = require("../middlewares/errorhandler");
const router = express.Router();

//관리자 로그인 API
//localhost:3017/admin/login
router.post("/admin/login", async (req, res, next) => {
    const { accountId, password, secretKey } = req.body;
    try {
        const adminUser = await Admins.findOne({ where: { accountId } })
        if (!adminUser) {
            throw new CustomError("아이디가 존재하지 않습니다.", 412)
        } else if (password !== adminUser.password) {
            throw new CustomError("비밀번호가 일치하지 않습니다.", 412)
        } else if (secretKey !== adminUser.secretkey) {
            throw new CustomError("시크릿키가 일치하지 않습니다.", 412)
        }
        // console.log(adminUser.nick)
        res.status(200).json({ "message": `${adminUser.nick}님이 로그인하였습니다.` })
    } catch (error) {
        next(error)
        // res.status(400).json({"errorMessage" : "뭔가 이상해유"})
    }
})


//관리자:전체유저조회API
//localhost:3017/admin/users
router.get("/admin/users", async (req, res, next) => {
    try {
        const users = await Users.findAll()
        res.status(200).json({ "users": users })
    } catch (error) {
        next(error)
    }
})

//관리자:특정유저삭제API
//localhost:3017/admin/users/:userId
router.delete("/admin/users/:userId", async (req, res, next) => {
    const { userId } = req.params;
    try {
        await Users.destroy({
            where: { userId }
        })
        res.status(200).json({ "message": "해당 회원을 삭제하였습니다." })
    } catch(error){
        next(error)
    }

})



module.exports = router;