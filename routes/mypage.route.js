const express = require('express');
const authmiddleware = require('../middlewares/auth-middleware.js');
const router = express.Router();

router.get('/mypage', authmiddleware, async (req, res) => {
  const account = req.locals.user;
  const donepostlist = await Posts.findAll({
    where: {
      accountId: account,
      isDone: true,
    },
  });
  const notDonepostlist = await Posts.findAll({
    where: {
      accountId: account,
      isDone: false,
    },
  });
  const postslist = { done: donepostlist, notdone: notDonepostlist };
  res.status(200).json({ posts: postslist });
});

module.exports = router;
