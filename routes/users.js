const express = require("express");
const router = express.Router();
const ctrl = require("../controller/user");
const wrap = require("../middlewares/wrap");
const { authChecker } = require("../middlewares/index");

/* GET users listing. */
router.post("/login", wrap(ctrl.login));
router.get("/logout", authChecker, wrap(ctrl.logout));
router.get("/login", authChecker, wrap(ctrl.showLoginPage));

module.exports = router;
