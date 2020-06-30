const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.redirect("/users/login");
  }
  try {
    req.jwt = jwt.verify(token, "53cr37K3Y");
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.redirect("/users/login");
    }
    next(error);
  }
};
