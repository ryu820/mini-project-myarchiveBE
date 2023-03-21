const express = require("express");
const { Admins, Users, Posts } = require("../models");
const CustomError = require("../middlewares/errorhandler");
const router = express.Router();

//관리자 로그인 API
//localhost:3017/admin
router.post("/admin", async (req, res, next) => {
    const { accountId, password, secretkey } = req.body;
    try {
        const adminUser = await Admins.findOne({ where: { accountId } })
        if (!adminUser || password !== adminUser.password) {
            throw new CustomError("아이디나 비밀번호가 틀렸슈~", 412)
        } else if (secretkey !== adminUser.secretkey) {
            throw new CustomError("시크릿키가 틀렸슈~", 412)
        }
        res.status(200).json({ "message": "로그인 성공했슈~" })
    } catch (error) {
        next(error)
        // res.status(400).json({"errorMessage" : "뭔가 이상해유"})
    }
})


//관리자:전체유저조회API
//localhost:3017/admin/user
router.get("/admin/user", async (req, res, next) => {
    try {
        const posts = await Users.findAll()
        res.status(200).json(posts)
    }catch(error){
        next(error)
    }
})

//관리자:특정유저삭제API
// router.post("/admin/user", async (req, res, next) => {

// })



module.exports = router;