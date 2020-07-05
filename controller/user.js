const User = require("../models/users");
const request = require("request-promise");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const getToken = async (dimigoid, dimigopw) => {
  const token_options = {
    uri: "https://api.dimigo.in/auth",
    method: "POST",
    body: {
      id: dimigoid,
      password: dimigopw,
    },
    json: true,
  };
  const getToken = (await request.post(token_options)).token;
  return getToken;
};

const getProfile = async (dimigoin_token) => {
  const jwt_options = {
    uri: "https://api.dimigo.in/user/jwt",
    method: "GET",
    headers: {
      Authorization: "Bearer " + dimigoin_token,
    },
    json: true,
  };
  const user_profile = await request.get(jwt_options);
  return user_profile;
};

const showRegisterPage = (req, res, next) => {
  res.render("user/register");
};

const register = async (req, res, next) => {
  const { id, pw } = req.body;
  const saltRounds = 10;
  const { name, grade, klass, number, serial } = await getProfile(
    await getToken(id, pw)
  );

  const alreadyCheck = await User.findOne({ id });
  if (alreadyCheck) return res.status(406).json({ message: "Already Exists" });

  bcrypt.hash(pw, saltRounds, async (err, hash) => {
    const userCreate = await User.create({
      id,
      pw: hash,
      name,
      grade,
      klass,
      number,
      serial,
    });
    res.status(201).json(userCreate);
  });
};

const showLoginPage = (req, res, next) => {
  res.render("user/login");
};

const login = async (req, res, next) => {
  const { id, pw } = req.body;

  const userAccount = await User.findOne({ id });
  if (!userAccount) return res.status(404).json({ message: "Incorrect" });
  const { name, grade, klass, number, serial } = userAccount;

  bcrypt.compare(pw, userAccount.pw, (err, same) => {
    if (!same) return res.status(401).json({ message: "Incorrect" });
    jwt.sign(
      { id, name, grade, klass, number, serial },
      process.env.JWT_KEY,
      (err, result) => {
        res.cookie("token", result, { httpOnly: true });
        res.locals.user = { name, grade, klass, number, serial };
        res.end();
      }
    );
  });
};

const logout = (req, res, next) => {
  res.clearCookie("token").redirect("/");
};

module.exports = { register, login, showLoginPage, showRegisterPage, logout };
