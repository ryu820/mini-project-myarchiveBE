const express = require("express");
const cookieParser = require("cookie-parser");
const postsRouter = require("./routes/posts.route");

const app = express();
const PORT = 3017;

app.use(cookieParser())
app.use(express.json());
app.use("/list", postsRouter);

app.listen(PORT, () => {
    console.log(` http://localhost:${PORT} `);
})