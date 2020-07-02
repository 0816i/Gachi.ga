const express = require("express");
const router = express.Router();
const ctrl = require("../controller/user");
const wrap = require("../middlewares/wrap");
const { authChecker } = require("../middlewares/index");

/* GET users listing. */
router.get("/register", authChecker, wrap(ctrl.showRegisterPage));
router.post("/register", wrap(ctrl.register));
router.get("/login", authChecker, ctrl.showLoginPage);
router.post("/login", wrap(ctrl.login));
router.get("/logout", authChecker, wrap(ctrl.logout));

module.exports = router;
