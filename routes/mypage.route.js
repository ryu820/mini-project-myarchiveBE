const express = require("express");
const {Posts} = require("../models")
const authmiddleware = require("../middlewares/auth-middleware.js")
const router = express.Router();

router.get("/mypage", authmiddleware, async(req,res) => {
    try{
        const {userId} = res.locals.user;
    const donepostlist = await Posts.findAll({
        where : {
            userId : userId,
            isDone : "true"
        }
    })
    const notDonepostlist = await Posts.findAll({
        where : {
            userId : userId,
            isDone : "false"
        }
    })
    const postslist = {done : donepostlist , notdone : notDonepostlist}
    res.status(200).json(postslist)
    }catch(err){
        res.status(400).json({"errorMessage": "게시글 조회에 실패하였습니다."})
    }
    
})

module.exports = router;