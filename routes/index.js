const express = require("express");
const router = express.Router();
const { wrap, authChecker } = require("../middlewares");
const control = require("../controller/apply");

/* GET home page. */
router.get("/", authChecker, wrap(control.showMainPage));

router.get("/list", authChecker, wrap(control.list));

router.get("/detail/:id", authChecker, wrap(control.detail));

router.get("/modify/:id", authChecker, wrap(control.showModifyPage));

router.get("/apply", authChecker, wrap(control.showApplyPage));

router.put("/join/:id", authChecker, wrap(control.join));

router.post("/apply", authChecker, wrap(control.makeapply));

router.post("/modify/:id", authChecker, wrap(control.modify));

router.post("/apply/:id", authChecker, wrap(control.makejoin));

router.delete("/delete/:id", authChecker, wrap(control.applydelete));

router.get("/mypage", authChecker, wrap(control.myGodata));

module.exports = router;
