const path = require("path");
const logger = require("morgan");
const express = require("express");
const cookieParser = require("cookie-parser");

exports.expressloader = (app) => {
  app.set("views", "./views");
  app.set("view engine", "ejs");

  app.use(logger("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static("./public"));
};
