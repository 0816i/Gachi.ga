const Godata = require("../models/godata");
const { response } = require("express");

const showMainPage = (req, res, next) => {
  res.render("index", { title: "메인페이지" });
};

const list = async (req, res, next) => {
  const result = await Godata.find().sort("-_id");
  res.render("list", { result });
};

const detail = async (req, res, next) => {
  const id = req.params.id;
  const result = await Godata.findById(id);

  res.status(200).render("detail", { result });
};

const showApplyPage = async (req, res, next) => {
  res.render("apply", { title: "등록" });
};

const makeapply = async (req, res, next) => {
  const { name, id, serial } = req.jwt;
  const { dest, detail, date, time, fill } = req.body;

  const create = Godata.create({
    name,
    id,
    serial,
    detail,
    dest,
    fill,
    date: new Date(date + " " + time),
    join: [req.jwt],
  });

  res.status(200).json({ message: "Correct" });
};

const makejoin = async (req, res, next) => {
  const id = req.params.id;

  const myApply = await Godata.findById(id);

  if (myApply.join.indexOf(req.jwt) != -1) {
    return res.status(401).json({ message: "Already Exists" });
  }

  myApply.join.push(req.jwt);

  Godata.findByIdAndUpdate(
    id,
    { $set: { join: myApply.join } },
    (err, result) => {
      if (err) return res.status(501).json({ message: "Error" });
      res.status(200).json({ message: "correct" });
    }
  );
};

const applydelete = async (req, res, next) => {
  const id = req.params.id;

  const tmpresult = await Godata.findById(id);
  if (tmpresult.id != req.jwt.id) {
    return res.status(403).json({ message: "forbiden" });
  }
  Godata.findByIdAndDelete(id, (err, result) => {
    if (err) next(err);
    return res.status(201).json({ message: "Success" });
  });
};

module.exports = {
  showMainPage,
  list,
  detail,
  makeapply,
  makejoin,
  showApplyPage,
  applydelete,
};
