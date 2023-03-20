const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const postsRouter = require("./routes/posts.route");
const usersRouter = require("./routes/user.route");
const MypageRouter = require("./routes/mypage.route");
const DetailRouter = require("./routes/detail.route");

const app = express();
const PORT = 3017;

// app.use(cors());
app.use(
  cors({
    origin: "*", //프론트의 url
    credentials: true, //쿠키정책
    optionsSuccessStatus: 200,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/", [postsRouter, usersRouter, MypageRouter]);
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
