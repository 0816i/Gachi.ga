const Godata = require("../models/godata");
const { io } = require("../loaders/index");

const options = (req, res) => {
  res.header("Allow", "GET, PUT, POST, DELETE");
  res.status(204).end();
};

const showMainPage = (req, res, next) => {
  res.render("index", { title: "메인페이지" });
};

const showModifyPage = async (req, res, next) => {
  const id = req.params.id;
  const result = await Godata.findById(id);

  if (result.id != res.locals.user.id) {
    return res.status(403).redirect(`/detail/${id}`);
  }

  res.status(200).render("modify", { result });
};

const showApplyPage = async (req, res, next) => {
  res.render("apply", { title: "등록" });
};

const list = async (req, res, next) => {
  const result = await Godata.find({ date: { $gte: Date.now() } }).sort({
    _id: -1,
  });
  res.render("list", { result });
};

const detail = async (req, res, next) => {
  const id = req.params.id;
  let my = false;
  let isJoin = false;
  const result = await Godata.findById(id);

  if (res.locals.user.id === result.id) {
    my = true;
  }

  if (!my) {
    for (let index = 0; index < result.join.length; index++) {
      if (result.join[index].id === res.locals.user.id) {
        isJoin = true;
        break;
      }
    }
  }

  return res.status(200).render("detail", { result, my, isJoin });
};

const makeapply = async (req, res, next) => {
  const { name, id, serial } = res.locals.user;
  const { dest, detail, date, time, fill } = req.body;

  const apply = new Godata({
    name,
    id,
    serial,
    detail,
    dest,
    fill,
    date: new Date(date + " " + time),
    join: [{ id, name, serial }],
  });

  await apply.save();

  return res.status(200).json({ message: "Correct" });
};

const applydelete = async (req, res, next) => {
  const id = req.params.id;
  const result = await Godata.findById(id);

  if (result.id != res.locals.user.id) {
    return res.status(403).json({ message: "내가 만든 모임이 아닙니다!" });
  }

  Godata.findByIdAndDelete(id, (err, result) => {
    if (err) next(err);
    return res.status(201).json({ message: "삭제되었습니다!" });
  });
};

const modify = async (req, res, next) => {
  const id = req.params.id;
  const { dest, detail, date, time, fill } = req.body;
  const { now } = await Godata.findById(id);

  if (fill < now) {
    return res.status(403).json({ message: "인원이 너무 적습니다." });
  }

  await Godata.findByIdAndUpdate(id, {
    detail,
    dest,
    fill,
    date: new Date(date + " " + time),
  });

  return res.status(200).json({ message: "수정되었습니다!" });
};

const join = async (req, res, next) => {
  const _id = req.params.id;
  const { name, id, serial } = res.locals.user;

  Godata.findOne({ _id, join: { $elemMatch: { id } } }, async (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ message: "잠시 후 다시 시도해주세요!" })
        .end();
    if (result)
      return res.status(403).json({ message: "이미 신청한 동행입니다!" }).end();
    const { now, fill } = await Godata.findById(_id);
    if (now + 1 > fill) {
      return res.status(403).json({ message: "한계 인원을 넘었습니다!" }).end();
    }
    Godata.findByIdAndUpdate(
      _id,
      { $inc: { now: 1 }, $push: { join: { name, id, serial } } },
      { new: true, upsert: true },
      (err, result) => {
        if (err)
          return req
            .status(500)
            .json({ message: "잠시 후 다시 시도해주세요!" });
        io.emit(_id, {
          id,
          now: result.now,
          fill: result.fill,
          text: `${serial} ${name}`,
          message: "make",
        });
        return res.status(200).json({ message: "신청이 완료되었습니다!" });
      }
    );
  });
};

const joindelete = async (req, res, next) => {
  const _id = req.params.id;
  const { id } = res.locals.user;

  Godata.findOne({ _id, join: { $elemMatch: { id } } }, async (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ message: "잠시 후 다시 시도해주세요!" })
        .end();
    if (!result)
      return res
        .status(404)
        .json({ message: "해당하는 모임을 찾을 수 없습니다!" })
        .end();
    Godata.findByIdAndUpdate(
      _id,
      {
        $inc: { now: -1 },
        $pull: { join: { id } },
      },
      { new: true },
      (err, result) => {
        if (err)
          return res
            .status(500)
            .json({ message: "잠시 후 다시 시도해주세요!" })
            .end();
        if (!result)
          return res
            .status(404)
            .json({ message: "해당하는 모임을 찾을 수 없습니다!" })
            .end();
        io.emit(_id, {
          id,
          now: result.now,
          fill: result.fill,
          message: "delete",
        });
        return res.status(200).json({ message: "처리되었습니다!" });
      }
    );
  });
};

const myGodata = async (req, res, next) => {
  const { id } = res.locals.user;
  const myData = await Godata.find({ id }).sort({ _id: -1 });
  const myjoinData = await Godata.find({
    join: { $elemMatch: { id } },
  }).sort({ _id: -1 });
  const finaldata = { myApply: [], myJoin: [] };
  if (myData === []) {
    finaldata.myApply = [];
  } else {
    finaldata.myApply = myData;
  }
  if (myjoinData === []) {
    finaldata.myJoin = [];
  } else {
    finaldata.myJoin = myjoinData;
  }
  res.status(200).render("mypage", { finaldata });
};

module.exports = {
  options,
  showMainPage,
  list,
  detail,
  makeapply,
  showApplyPage,
  applydelete,
  showModifyPage,
  modify,
  join,
  joindelete,
  myGodata,
};
