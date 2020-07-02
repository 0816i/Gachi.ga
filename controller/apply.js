const Godata = require("../models/godata");
const { response } = require("express");
const { TooManyRequests } = require("http-errors");

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
  if (!req.jwt) {
    return res.redirect("/users/login");
  }
  var my = false;
  if (req.jwt.id === result.id) {
    my = true;
  }
  res.status(200).render("detail", { result, my });
};

const showApplyPage = async (req, res, next) => {
  res.render("apply", { title: "등록" });
};

const makeapply = async (req, res, next) => {
  const { name, id, grade, klass, serial, number } = req.jwt;
  const { dest, detail, date, time, fill } = req.body;

  const create = Godata.create({
    name,
    id,
    serial,
    detail,
    dest,
    fill,
    date: new Date(date + " " + time),
    join: [{ name, id, grade, klass, serial, number }],
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

const showModifyPage = async (req, res, next) => {
  const id = req.params.id;
  const tmpresult = await Godata.findById(id);

  if (tmpresult.id != req.jwt.id) {
    return res.status(403).redirect(`/detail/${id}`);
  }

  const result = await Godata.findById(id);

  res.status(200).render("modify", { result });
};

const modify = async (req, res, next) => {
  const id = req.params.id;

  const { dest, detail, date, time, fill } = req.body;

  const tmpresult = await Godata.findByIdAndUpdate(id, {
    detail,
    dest,
    fill,
    date: new Date(date + " " + time),
  });
  res.status(200).json({ message: "success" });
};

const join = async (req, res, next) => {
  const _id = req.params.id;
  const { name, id, grade, klass, serial, number } = req.jwt;
  const find = await Godata.findById(_id);
  for (let index = 0; index < find.join.length; index++) {
    if (find.join[index].id === req.jwt.id) {
      return res.status(403).json({ message: "already exists" });
    }
  }

  find.join.push({ name, id, grade, klass, serial, number });
  find.now += 1;

  if (find.now <= find.fill) {
    Godata.findByIdAndUpdate(
      _id,
      { $set: { join: find.join, now: find.now } },
      (err, result) => {
        if (err) return req.status(500).json({ message: "DBError" });
        return res.status(200).json({ message: "Success" });
      }
    );
  } else {
    res.status(403).json({ message: "too many students" });
  }
};

const myGodata = async (req, res, next) => {
  const myData = await Godata.find();
  const { id } = req.jwt;
  const finaldata = { myApply: [], myJoin: [] };
  for (let index = 0; index < myData.length; index++) {
    if (myData[index].id === id) {
      finaldata.myApply.push(myData[index]);
    } else {
      for (let indexs = 0; indexs < myData[index].join.length; indexs++) {
        if (myData[index].join[indexs].id === id) {
          finaldata.myJoin.push(myData[index]);
        }
      }
    }
  }
  res.status(200).json(finaldata);
};

module.exports = {
  showMainPage,
  list,
  detail,
  makeapply,
  makejoin,
  showApplyPage,
  applydelete,
  showModifyPage,
  modify,
  join,
  myGodata,
};
