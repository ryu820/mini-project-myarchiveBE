const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const postsRouter = require("./routes/posts.route");
const usersRouter = require("./routes/user.route");
const MypageRouter = require("./routes/mypage.route");
const DetailRouter = require("./routes/detail.route");
const AdminRouter = require("./routes/admins.route.js")

const app = express();
const PORT = 3017;

// app.use(cors());
app.use(
  cors({
    origin:true,
    "Access-Control-Allow-Origin": [
      "http://mini-project-myarchive.s3-website.ap-northeast-2.amazonaws.com/",
      "http://localhost:3000"
    ], //프론트의 url
    optionsSuccessStatus: 200,
    "Access-Control-Expose-Headers": 'token',
    "Access-Control-Expose-Credentials": true
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/", [postsRouter, usersRouter, MypageRouter,AdminRouter]);
app.use("/post", DetailRouter);

app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(error.status || 500).json({
    "errorMessage": error.message || "예상치 못한 에러가 발생하였습니다.",
  });
});

app.listen(PORT, () => {
  console.log(` http://localhost:${PORT} `);
});
