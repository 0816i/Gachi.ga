const express = require("express");
const router = express.Router();
const { wrap } = require("../middlewares");
const control = require("../controller/apply");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "메인페이지" });
});

router.get("/list", wrap(control.list));

router.get("/detail/:id", wrap(control.detail));

router.get("/apply", (req, res, next) => {
  res.render("apply", { title: "등록" });
});

router.post("/apply", wrap(control.make_apply));

router.post("/apply/:id", wrap(control.make_join));

module.exports = router;
