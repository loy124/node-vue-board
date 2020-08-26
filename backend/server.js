const express = require("express");
const app = express();
const morgan = require("morgan");
const PORT = 8000;
const { sequelize, User, Post } = require("./models");
const { hashPassword, comparePassword } = require("./utils/bcrypt");
const cors = require("cors");

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use(
    cors({
      origin: true,
      credentials: true, //도메인이 다른경우 서로 쿠키등을 주고받을때 허용해준다고 한다
    })
  );
  


// 1차 테이블 생성하기
sequelize
  .sync({ force: false })
  .then(() => console.log("db 접속 성공"))
  .catch((err) => console.log(err));

app.get("/api/user", (req, res) => {});

app.post("/api/user", async (req, res) => {
  //  CRUD 구현을 해야한다.
  try {
    const { email, password, name } = req.body;
    if (email && password && name) {
      const hashedPassword = await hashPassword(password);
      const data = await User.create({
        email: email,
        //  암호화가 들어가야한다.
        password: hashedPassword,
        name: name,
      });
      console.log(data);
      return res.json({ signup: true });
    } else {
      throw new Error();
    }
  } catch (err) {
    console.log(err);
    return res.json({ signup: false });
  }
});

app.patch("/api/user", (req, res) => {});

app.delete("/api/user", (req, res) => {});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  //   console.log(email, password);
  //    db의 비밀번호 가져오기
  const userData = await User.findOne({
    attributes: ["id", "password"],
    where: {
      email: email,
    },
  });
  //   console.log(userData);
  const hashedPassword = userData.dataValues.password;
  //   console.log(hashPassword);
  const compareResult = await comparePassword(password, hashedPassword);
  //   console.log(compareResult);
  // 비밀번호를 비교해서 로그인이 성공하였음
  // 이곳에서 로그인정보를 세션에 저장해야한다.
  if (compareResult) {
    return res.json({ login: true, id: userData.dataValues.id });
  }
  return res.json({ login: false });
});

// 게시판 부분
app.get("/api/post", (req, res) => {
  // DB 테이블 생성하기
});

app.post("/api/post", (req, res) => {
  //  CRUD 구현을 해야한다.
});

app.patch("/api/post", (req, res) => {});

app.delete("/api/post", (req, res) => {});

app.listen(PORT, () => console.log(`this server listening on ${PORT}`));