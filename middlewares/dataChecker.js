const jwt = require("jsonwebtoken");
const user = require("../controller/user");

module.exports = (req, res, next) => {
  try {
    if (!res.locals.user) {
      return res.redirect("/users/login");
    } else {
      return next();
    }
  } catch (error) {
    res.clearCookie("token");
    return res.redirect("/users/login");
  }
};
