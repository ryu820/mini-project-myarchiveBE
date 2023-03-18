const express = require("express");
const { Posts } = require("../models")
const authmiddleware = require("../middlewares/auth-middleware.js")
const router = express.Router();


//유저 게시글 조회API
router.get("/mypage", authmiddleware, async (req, res) => {
    try {
        const { userId } = res.locals.user;
        const donepostlist = await Posts.findAll({
            attributes: ['postId','url','title','category','desc','isdone','createdAt', 'updatedAt'],
            where: {
                userId: userId,
                isDone: true
            },
            order :[['createdAt', 'DESC']]
        })
        const notDonepostlist = await Posts.findAll({
            attributes: ['postId','url','title','category','desc','isdone','createdAt', 'updatedAt'],
            where: {
                userId: userId,
                isDone: false
            },
            order :[['createdAt', 'DESC']]
        })
        const postslist = { done: donepostlist, notdone: notDonepostlist }
        // const postslist_test= postslist.notdone
        res.status(200).json(postslist)
    } catch (err) {
        res.status(400).json({ "errorMessage": "게시글 조회에 실패하였습니다." })
    }
})


module.exports = router;
