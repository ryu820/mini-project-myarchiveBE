const MypageRepository = require("../repositories/mypage.repositories.js")
const CustomError = require("../middlewares/errorhandler");
const axios = require("axios");
const cheerio = require("cheerio");

class MypageService {
    constructor() {
        this.MypageRepository = new MypageRepository();
    }

    getPost = async (userId) => {
        const donepostlist = await this.MypageRepository.FindAll(userId, true)
        const notDonepostlist = await this.MypageRepository.FindAll(userId, false)

        const postslist = { done: donepostlist, notdone: notDonepostlist };
        return postslist;
    }
    
    existPost = async ({ postId, userId }) => {
        const existPost = await this.MypageRepository.FindOne({ postId, userId })
        //게시글이 존재하지 않을 때
        if (!existPost) {
            throw new CustomError("게시글이 존재하지 않습니다.", 403);
        }
        //수정권한이 없을때
        if (userId !== existPost.userId) {
            throw new CustomError("게시글 수정의 권한이 존재하지 않습니다.", 403);
        }
        return existPost;
    }

    ModifyPost = async ({ postId, userId, postUrl, title, desc }) => {
        //url 수정
        let imageUrl;

        if (postUrl) {
            const response = await axios.get(postUrl); //이거 두개 if로 걸러주고
            let $ = cheerio.load(response.data);
            imageUrl =
                $("img#mainImg").attr("src") ||
                $('meta[property="og:image"]').attr("content");
        } else {
            undefined;
        }
        //수정 업데이트
        await this.MypageRepository.updatePost({ postId, userId, postUrl, imageUrl, title, desc })
    }

    checkWishList = async ({ postId, userId,existPost }) => {
        if (existPost.isDone == false) {
            const done = true;
            await this.MypageRepository.updateWishList({ postId, userId, done });
            const message = "위시리스트에서 구매리스트로 이동하였습니다."
            return message;
        } else if (existPost.isDone == true) {
            const done = false;
            await this.MypageRepository.updateWishList({ postId, userId, done });
            const message = "구매리스트에서 위시리스트로 이동하였습니다."
            return message;
        }
        
    }

}

module.exports = MypageService;