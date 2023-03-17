const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const router = express.Router();
const { Posts } = require('../models');

router.get('/post', async (req, res) => {
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

router.post('/post', async (req, res) => {
  //   try {
  // const { postId, accountId, nick } = res.locals.user;
  const { userId, url, title, category, desc, isDone } = req.body;

  const now = new Date();
  const posts = await Posts.create({
    // postId: postId,
    // accountId,
    userId,
    url,
    // nick,
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
  res.status(200).json({ posts: posts });
  //   } catch (error) {
  //     return res
  //       .status(412)
  //       .json({ errorMessage: '데이터 형식이 올바르지 않습니다.' });
  //   }
});

router.delete('/post/:postId', async (req, res) => {
  try {
    // const { userId } = res.locals.user;
    const { postId } = req.params;

    const post = await Posts.findOne({ where: { postId } });
    if (!post) {
      return res
        .status(404)
        .json({ errorMessage: '게시글이 존재하지 않습니다.' });
    }
    // else if(post.userId !== userId) {
    //  return res.status(403).json({errorMessage:"게시글의 삭제권한이 존재하지 않습니다."})
    //   }

    await Posts.destroy({
      where: { postId },
      // where: {
      //   [Op.and]: [{ postId }, { userId: userId }],
      // },
    });
    return res.status(200).json({ Message: '게시글이 삭제되었습니다.' });
  } catch (error) {
    return res
      .status(400)
      .json({ errorMessage: '게시글이 정상적으로 삭제되지 않았습니다.' });
  }
});

module.exports = router;
