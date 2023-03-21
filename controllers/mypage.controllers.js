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
            if (existPost.isDone == false) {
                const done = true;
                await this.MypageService.checkWishList({ postId, userId, done });
                return res.status(200).json({ message: "위시리스트에서 구매리스트로 이동하였습니다." });

            } else if (existPost.isDone == true) {
                const done = false;
                await this.MypageService.checkWishList({ postId, userId, done });
                return res.status(200).json({ message: "구매리스트에서 위시리스트로 이동하였습니다." });
            }
        } catch (error) {
            next(error);
        }
    }
}

module.exports = MypageController;