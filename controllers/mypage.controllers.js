const MypageService = require("../services/mypage.services.js")

class MypageController {
    constructor() {
        this.MypageService = new MypageService();
    }
    getPost = async (req, res, next) => {
        try {
            const { userId } = res.locals.user;
            const postslist = await this.MypageService.getPost(userId);
            res.status(200).json(postslist);
        } catch (error) {
            next(error)
            // res.status(400).json({ errorMessage: "게시글 조회에 실패하였습니다." });
        }
    }

    ModifyPost = async (req, res, next) => {
        const { userId } = res.locals.user;
        const { postId } = req.params;
        const { url: postUrl, title, desc } = req.body;
        try {
            //권한 확인 및 게시글 확인
            await this.MypageService.existPost({ postId, userId })
            //게시글 수정
            await this.MypageService.ModifyPost({ postId, userId, postUrl, title, desc })
            res.status(200).json({ message: "게시글을 수정하였습니다." });
        } catch (error) {
            next(error);
        }
    }

    checkWishList = async (req, res, next) => {
        const { postId } = req.params;
        const { userId } = res.locals.user;
        try {
            const existPost = await this.MypageService.existPost({ postId, userId })
            const message = await this.MypageService.checkWishList({postId, userId,existPost})
            res.status(200).json({"message" : message})
        } catch (error) {
            next(error);
        }
    }
}

module.exports = MypageController;