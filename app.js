const express = require('express');
const cookieParser = require('cookie-parser');
const postsRouter = require('./routes/posts.route');
const usersRouter = require('./routes/user.route');

const app = express();
const PORT = 3017;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/list', postsRouter);
app.use('/', [usersRouter]);

app.listen(PORT, () => {
  console.log(` http://localhost:${PORT} `);
});
