const express = require("express");
const authmiddleware = require("../middlewares/auth-middleware");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");
const { Posts } = require("../models");

//게시글 조회api
router.get("/post", authmiddleware, async (req, res) => {
  try {
    const posts = await Posts.findAll({
      attribute: [
        "postId",
        "accountId",
        "nick",
        "url",
        "category",
        "title",
        "desc",
        "createdAt",
        "updatedAt",
      ],
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ posts: posts });
  } catch (error) {
    console.log(err.stack);
    return res
      .status(400)
      .json({ errorMessage: "게시글조회에 실패하였습니다." });
  }
});

//게시글 생성 api
router.post("/post", authmiddleware, async (req, res) => {
  try {
    const { accountId, nick, userId } = res.locals.user;
    const { url: postUrl, title, category, desc, isDone } = req.body;

    if (!title) {
      return res.status(410).json({ errorMessage: "title을 입력해주세요" });
    }
    if (!desc) {
      return res.status(410).json({ errorMessage: "desc를 입력해주세요." });
    }
    if (title > 50) {
      return res
        .status(412)
        .json({ errorMessage: "게시글 제목이 형식이 올바르지않습니다." });
    }
    if (desc > 500) {
      return res
        .status(412)
        .json({ errorMessage: "게시글 내용의 형식이 일치하지않습니다." });
    }

    //url을 가지고 크롤링해오는 api

    //axios모듈을 사용해서 postUrl로 get요청을 보내 HTML데이터를 가져온다.
    const response = await axios.get(postUrl);
    //$에 cheerio모듈로 파싱해온 HTML데이터를 할당한다
    const $ = cheerio.load(response.data);
    //img mainImg의 src에 붙어있는 url을 가져온다.
    let imageUrl = $("img#mainImg").attr("src");
    console.log(imageUrl);

    //url이 존재하지 않으면
    if (!imageUrl || imageUrl === undefined) {
      //메타태그의 og:image의 content에 적힌 url을 가져온다
      imageUrl = $('meta[property="og:image"]').attr("content");
    } else {
      //값이 없다면 undefined
      imageUrl = undefined;
    }

    const now = new Date();
    const posts = await Posts.create({
      accountId: accountId,
      userId: userId,
      url: imageUrl,
      nick: nick,
      title,
      category,
      desc,
      isDone,
      createdAt: now,
      updatedAt: now,
    });
    if (!posts) {
      return res
        .status(412)
        .json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
    }
    res
      .status(201)
      .json({ posts: posts, Message: "게시글 작성에 성공하였습니다." });
  } catch (error) {
    console.log(err.stack);
    return res
      .status(412)
      .json({ errorMessage: "게시글 작성에 실패하였습니다." });
  }
});

//게시글 삭제 api
router.delete("/post/:postId", authmiddleware, async (req, res) => {
  try {
    const { userId } = res.locals.user;
    const { postId } = req.params;

    const post = await Posts.findOne({ where: { postId } });
    if (!post) {
      return res
        .status(404)
        .json({ errorMessage: "게시글이 존재하지 않습니다." });
    } else if (post.userId !== userId) {
      return res
        .status(403)
        .json({ errorMessage: "게시글의 삭제권한이 존재하지 않습니다." });
    }

    await Posts.destroy({
      where: {
        [Op.and]: [{ postId }, { userId: userId }],
      },
    });
    return res.status(200).json({ Message: "게시글이 삭제되었습니다." });
  } catch (error) {
    console.log(err.stack);
    return res
      .status(401)
      .json({ errorMessage: "게시글이 정상적으로 삭제되지 않았습니다." });
  }
});

module.exports = router;
