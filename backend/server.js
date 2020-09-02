const express = require("express");
const app = express();
const morgan = require("morgan");
const PORT = 8000;
const { sequelize, User, Post } = require("./models");
const { hashPassword, comparePassword } = require("./utils/bcrypt");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const { logger } = require("./utils/winston");
const fs = require("fs").promises;

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: true,
    credentials: true, //도메인이 다른경우 서로 쿠키등을 주고받을때 허용해준다고 한다
    exposedHeaders: ["Content-Disposition"],
  })
);

const upload = multer({
  storage: multer.diskStorage({
    // set a localstorage destination
    //   어떤이름으로 저장할지가 들어있다.

    //위치 지정
    destination: (req, file, done) => {
      done(null, "uploads/");
    },
    //지정
    // convert a file name
    filename: (req, file, done) => {
      const ext = path.extname(file.originalname);
      console.log(file.mimetype);
      const fileName =
        path.basename(file.originalname, ext) + "&&" + Date.now() + ext;
      done(null, fileName);
      // cb(null, new Date().valueOf() + path.extname(file.originalname));
      req.fileDir = `${fileName}`;
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

// 1차 테이블 생성하기
sequelize
  .sync({ force: false })
  .then(() => console.log("db 접속 성공"))
  .catch((err) => console.log(err));

app.get("/api/user", async (req, res) => {
  logger.info("Success");
  return res.json({ success: true });
});

app.post("/api/user", async (req, res) => {
  //  CRUD 구현을 해야한다.
  try {
    // throw new Error("error");
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
    logger.error(err);
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
app.get("/api/post", async (req, res) => {
  try {
    const postList = await Post.findAll({});
    console.log(postList);
    return res.json({ postList });
  } catch (error) {
    console.log(error);
    logger.error(error);
  }
});

app.get("/api/post/:id", async (req, res) => {
  try {
    // throw new Error("error");
    console.log(req.params);
    const { id } = req.params;
    const { dataValues } = await Post.findOne({
      where: {
        id: id,
      },
    });
    console.log(dataValues);
    // if 업로드 종류가 json 일때만 해당 로직을 실행한다.
    // console.log(dataValues.file);
    if (dataValues.file) {
      if (dataValues.file.split(".").reverse()[0] === "txt") {
        const log = await fs.readFile(
          `${__dirname}/uploads/${dataValues.file}`
        );
        console.log(log.toString());
        return res.json({ post: dataValues, log: log.toString().trim() });
      }
    }

    return res.json({ post: dataValues });
  } catch (error) {
    console.log(error);
    logger.error(error);
  }
});

app.post("/api/post", upload.single("file"), async (req, res) => {
  //  CRUD 구현을 해야한다.
  try {
    console.log(req.body);
    // 파일의 저장 경로
    const { userId, title, content } = req.body;
    console.log(req.fileDir);
    // 남은건 DB 연동하기
    const post = await Post.create({
      title: title,
      content: content,
      file: req.fileDir,
      user_id: userId,
    });
    console.log(post);
    return res.json({ hello: "hello" });
  } catch (error) {
    console.log(error);
    logger.error(error);
  }
});

app.patch("/api/post", (req, res) => {});

app.delete("/api/post", (req, res) => {});

app.get("/api/download", async (req, res) => {
  try {
    console.log(req.body);
    const { fileName } = req.query;
    // const {fileName} = req.body.params;
    // console.log(fileName);
    const file = await fs.readFile(`${__dirname}/uploads/${fileName}`);

    // res.setHeader('Content-Length', file.length);
    // res.write(file, 'binary');
    // res.end();
    // console.log(file);
    // console.log(file.toString());
    // file.
    // res.setHeader("Content-Type", "application/octet-stream");

    // res.setHeader("Content-Type", "application/pdf");
    // return res.download(file);
    return res.send(file);
  } catch (err) {
    console.log(err);
    logger.error(err);
  }
});

app.listen(PORT, () => console.log(`this server listening on ${PORT}`));
