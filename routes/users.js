const express = require("express");
const router = express.Router();
const ctrl = require("../controller/user");
const wrap = require("../middlewares/wrap");

/* GET users listing. */
router.get("/register", wrap(ctrl.showRegisterPage));
router.post("/register", wrap(ctrl.register));
router.get("/login", ctrl.showLoginPage);
router.post("/login", wrap(ctrl.login));

module.exports = router;
