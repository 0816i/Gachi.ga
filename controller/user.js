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
      username: dimigoid,
      password: dimigopw,
    },
    json: true,
  };
  try {
    const getToken = (await request.post(token_options)).token;
    return getToken;
  } catch (err) {
    if (err.statusCode === 404) {
      return false;
    }
    console.log(err);
  }
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

const showLoginPage = (req, res, next) => {
  res.render("user/login");
};

const login = async (req, res, next) => {
  const { id, pw } = req.body;
  let userAccount = await User.findOne({ id });
  if (!userAccount) {
    const token = await getToken(id, pw);
    if (token === false) {
      return res.status(404).end();
    }
    const { name, grade, klass, number, serial } = await getProfile(token);
    const saltRounds = 10;
    const hash = await bcrypt.hash(pw, saltRounds);
    const userCreate = await User.create({
      id,
      pw: hash,
      name,
      grade,
      klass,
      number,
      serial,
    });
    userAccount = userCreate;
  }
  const { name, grade, klass, number, serial } = userAccount;

  bcrypt.compare(pw, userAccount.pw, (err, same) => {
    if (!same)
      return res.status(401).json({ message: "저장된 정보가 다릅니다." });
    jwt.sign(
      { id, name, grade, klass, number, serial },
      process.env.JWT_KEY,
      (err, result) => {
        res.cookie("token", result);
        res.status(200).send("done");
      }
    );
  });
};

const logout = (req, res, next) => {
  res.clearCookie("token");
  res.redirect("/");
};

module.exports = { login, showLoginPage, logout };
