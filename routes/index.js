const express = require("express");
const router = express.Router();
const { wrap, authChecker } = require("../middlewares");
const control = require("../controller/apply");

/* GET home page. */
router.get("/", wrap(control.showMainPage));

router.get("/list", wrap(control.list));

router.get("/detail/:id", authChecker, wrap(control.detail));

router.get("/apply", authChecker, wrap(control.showApplyPage));

router.post("/apply", authChecker, wrap(control.makeapply));

router.post("/apply/:id", authChecker, wrap(control.makejoin));

router.delete("/delete/:id", authChecker, wrap(control.applydelete));

module.exports = router;
