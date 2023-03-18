const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const postsRouter = require("./routes/posts.route");
const usersRouter = require("./routes/user.route");
const MypageRouter = require("./routes/mypage.route");

app.use(cors());
const app = express();
const PORT = 3017;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/list", postsRouter);
app.use("/", [usersRouter, MypageRouter]);
// app.use(
//   cors({
//     origin: "localhost:3017",
//     credentials: true,
//     optionsSuccessStatus: 200,
//   })
// );

app.listen(PORT, () => {
  console.log(` http://localhost:${PORT} `);
});
