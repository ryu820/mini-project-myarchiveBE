const express = require("express");
const authmiddleware = require("../middlewares/auth-middleware");
const CustomError = require("../middlewares/errorhandler.js")
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");
const { Posts , Users } = require("../models");
const { Op } = require("sequelize");

//게시글 조회api
//localhost:3017
router.get("/", async (req, res, next) => {

  try {
    const posts = await Posts.findAll({
      raw: true,
      attributes: ["postId","User.accountId","User.nick","url","category","title","desc","isDone"],
      order: [["createdAt", "DESC"]],
      include: [{
        model: Users,
        attributes: []
    }]
    });
    res.status(200).json({ posts: posts });
  } catch (error) {
    next(error)
    return res
      .status(400)
      .json({ "errorMessage": "게시글조회에 실패하였습니다." });
  }
});

//게시글 생성 api
//localhost:3017/post
router.post("/post", authmiddleware, async (req, res, next) => {
  try {
    const { userId } = res.locals.user;
    const { url: postUrl, title, category, desc } = req.body;

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

    //url을 가지고 크롤링해오는 api

    //axios모듈을 사용해서 postUrl로 get요청을 보내 HTML데이터를 가져온다.
    // const response = await axios.get(postUrl);
    // //$에 cheerio모듈로 파싱해온 HTML데이터를 할당한다
    // const $ = cheerio.load(response.data);
    // //img mainImg의 src에 붙어있는 url을 가져온다.
    // let imageUrl = $("img#mainImg").attr("src");
    // console.log(imageUrl);

    // //url이 존재하지 않으면
    // if (!imageUrl || imageUrl === undefined) {
    //   //메타태그의 og:image의 content에 적힌 url을 가져온다
    //   imageUrl = $('meta[property="og:image"]').attr("content");
    // } else {
    //   //값이 없다면 undefined
    //   let imageUrl = undefined;
    // }

    const now = new Date();
    const posts = await Posts.create({
      userId: userId,
      url: postUrl, //나중에 고치기!!!!!!!!!!
      title,
      category,
      desc,
      isDone: false,
      createdAt: now,
      updatedAt: now,
    });
    if (!posts) {
      throw new CustomError("데이터 형식이 올바르지 않습니다..", 412);
    }
    res
      .status(201)
      .json({"message": "게시글 작성에 성공하였습니다." });

  } catch (error) {
    next(error)
    return res
      .status(412)
      .json({ "errorMessage": "게시글 작성에 실패하였습니다." });
  }
})
//게시글 삭제 api
//localhost:3017/post/:postId
router.delete("/post/:postId", authmiddleware, async (req, res, next) => {
  try {
    const { userId } = res.locals.user;
    const { postId } = req.params;
   
    const post = await Posts.findOne({ where: { postId } });

    if (!post) {
      throw new CustomError("게시글이 존재하지 않습니다.", 404);
    } else if (post.userId !== userId) {
      throw new CustomError("게시글의 삭제권한이 존재하지 않습니다.", 403);
    }
    console.log(post)
    await Posts.destroy({
      where: {
        [Op.and]: [{ postId }, { userId: userId }],
      },
    });
    return res.status(200).json({ "message": "게시글이 삭제되었습니다." });
  } catch (error) {
    next(error)
    return res
      .status(401)
      .json({ "errorMessage": "게시글이 정상적으로 삭제되지 않았습니다." });
  }
});
module.exports = router;
