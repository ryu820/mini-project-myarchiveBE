const express = require('express');
const authMiddleware = require('../middlewares/auth-middleware');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');
const { Posts } = require('../models');

//게시글 조회api
router.get('/post', authMiddleware, async (req, res) => {
  try {
    const posts = await Posts.findAll({
      attribute: [
        'postId',
        'accountId',
        'nick',
        'url',
        'category',
        'title',
        'desc',
        'createdAt',
        'updatedAt',
      ],
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json({ posts: posts });
  } catch (error) {
    return res
      .status(400)
      .json({ errorMessage: '게시글조회에 실패하였습니다.' });
  }
});

//게시글 생성 api
router.post('/post', authMiddleware, async (req, res) => {
  try {
    const { accountId, nick, userId } = res.locals.user;
    const { url, title, category, desc, isDone } = req.body;

    if (title > 50) {
      return res
        .status(412)
        .json({ errorMessage: '게시글 제목이 형식이 올바르지않습니다.' });
    }
    if (desc > 500) {
      return res
        .status(412)
        .json({ errorMessage: '게시글 내용의 형식이 일치하지않습니다.' });
    }
    const now = new Date();
    const posts = await Posts.create({
      accountId: accountId,
      userId: userId,
      url,
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
        .json({ errorMessage: '데이터 형식이 올바르지 않습니다.' });
    }
    res
      .status(200)
      .json({ posts: posts, Message: '게시글 작성에 성공하였습니다.' });
  } catch (error) {
    return res
      .status(412)
      .json({ errorMessage: '게시글 작성에 실패하였습니다.' });
  }
});

//게시글 삭제 api
router.delete('/post/:postId', authMiddleware, async (req, res) => {
  try {
    const { userId } = res.locals.user;
    const { postId } = req.params;

    const post = await Posts.findOne({ where: { postId } });
    if (!post) {
      return res
        .status(404)
        .json({ errorMessage: '게시글이 존재하지 않습니다.' });
    } else if (post.userId !== userId) {
      return res
        .status(403)
        .json({ errorMessage: '게시글의 삭제권한이 존재하지 않습니다.' });
    }

    await Posts.destroy({
      where: {
        [Op.and]: [{ postId }, { userId: userId }],
      },
    });
    return res.status(200).json({ Message: '게시글이 삭제되었습니다.' });
  } catch (error) {
    return res
      .status(400)
      .json({ errorMessage: '게시글이 정상적으로 삭제되지 않았습니다.' });
  }
});

module.exports = router;
