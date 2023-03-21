const PostService = require("../services/posts.services");
const CustomError = require("../middlewares/errorhandler.js");

class PostController {
  constructor() {
    this.PostService = new PostService();
  }

  getPosts = async (req, res, next) => {
    try {
      const posts = await this.PostService.getPosts({});

      res.status(200).json({ posts: posts });
    } catch (error) {
      next(error);
      return res
        .status(400)
        .json({ errorMessage: "게시글 조회에 실패하였습니다." });
    }
  };
  createPost = async (req, res, next) => {
    const { userId } = res.locals.user;
    const { url: postUrl, title, category, desc } = req.body;
    try {
      if (!title) {
        throw new CustomError("title을 입력해주세요", 410);
      }
      if (!desc) {
        throw new CustomError("desc를 입력해주세요.", 410);
      }
      if (Number(title.length) > 50 || typeof title !== "string") {
        throw new CustomError("게시글 제목이 형식이 올바르지않습니다.", 412);
      }
      if (Number(desc.length) > 500 || typeof desc !== "string") {
        throw new CustomError("게시글 내용의 형식이 일치하지않습니다.", 412);
      }
      const posts = await this.PostService.createPost({
        userId,
        url: postUrl,
        title,
        category,
        desc,
        isDone: false,
      });
      res.status(201).json({ posts, message: "게시글 작성에 성공하였습니다." });
    } catch (error) {
      // next(error);
      return res
        .status(412)
        .json({ errorMessage: "게시글 작성에 실패하였습니다." });
    }
  };

  delPost = async (req, res, next) => {
    const { postId } = req.params;
    const { userId } = res.locals.user;
    try {
      const posts = await this.PostService.delPost(postId, userId);

      res.status(200).json({ message: "게시글이 삭제되었습니다." });
    } catch (error) {
      next(error);
      return res
        .status(401)
        .json({ errorMessage: "게시글이 정상적으로 삭제되지 않았습니다." });
    }
  };
}

module.exports = PostController;
