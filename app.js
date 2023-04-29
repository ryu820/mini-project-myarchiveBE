const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const postsRouter = require("./routes/posts.route");
const usersRouter = require("./routes/user.route");
const MypageRouter = require("./routes/mypage.route");
const DetailRouter = require("./routes/detail.route");
const AdminRouter = require("./routes/admins.route.js");
const fs = require("fs");

require("dotenv").config();
const morgan = require("morgan");
const logger = require("./config/logger")

const app = express();
const PORT = 3017;

// app.use(cors());
app.use(
  cors({
    "Access-Control-Allow-Origin": [
      "*",
      // "http://mini-project-myarchive.s3-website.ap-northeast-2.amazonaws.com/",
      // "http://localhost:3000"
    ], //프론트의 url
    credentials: true, //쿠키정책
    optionsSuccessStatus: 200,
    exposedHeaders: ["token"],
  })
);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/", [postsRouter, usersRouter, MypageRouter, AdminRouter]);
app.use("/post", DetailRouter);


app.use((error, req, res, next) => {
  res.status(error.status || 500);
  error.message = error.message || '예상치 못한 에러가 발생하였습니다.'

  //에러로그파일 생성 및 저장
  const errorstack = error.stack || error.message
  logger.error(errorstack)

  res.json({ errormessage: error.message });
});

app.listen(PORT, () => {
  logger.info(` http://localhost:${PORT} `);
})
