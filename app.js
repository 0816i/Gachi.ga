const createError = require("http-errors");
const express = require("express");
const { createServer } = require("http");
const { expressloader, mongoose, listenIO } = require("./loaders/index");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const { dbOn } = require("./loaders/mongoose");

const app = express();

expressloader(app);
const db = dbOn();

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  //console.log(err);
  // render the error page
  res.status(err.status || 500);
  res.json({ message: err.message });
});

const server = createServer(app);
server.listen(3000, () => console.log("Server Started"));
listenIO(server);
