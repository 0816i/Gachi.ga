const createError = require("http-errors");
const express = require("express");
const { createServer } = require("http");
const { expressloader, listenIO, dbOn } = require("./loaders/index");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const { list } = require("./controller/apply");

const app = express();
const db = dbOn();

expressloader(app);

app.use("/", indexRouter);
app.use("/users", usersRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.json({ message: "알 수 없는 에러가 발생했습니다!" });
  console.log(err);
});

const server = createServer(app);
server.listen(3000, () => console.log("Server Started"));
listenIO(server);
