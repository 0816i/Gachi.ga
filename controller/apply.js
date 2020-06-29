const Godata = require("../models/godata");
const Apply = require("../models/apply");
const request = require("request-promise");
const { Template } = require("ejs");

const dimigoin_token = async (dimigoid, dimigopw) => {
  const token_options = {
    uri: "https://api.dimigo.in/auth",
    method: "POST",
    body: {
      id: dimigoid,
      password: dimigopw,
    },
    json: true,
  };
  const dimigo_token = (await request.post(token_options)).token;
  return dimigo_token;
};

const dimigoin_jwt = async (dimigoin_token) => {
  const jwt_options = {
    uri: "https://api.dimigo.in/user/jwt",
    method: "GET",
    headers: {
      Authorization: "Bearer " + dimigoin_token,
    },
    json: true,
  };
  const user_profile = await request.get(jwt_options);
  return user_profile;
};

const list = async (req, res, next) => {
  const lists = await Godata.find();
  res.render("list", { result: lists });
};

const detail = async (req, res, next) => {
  const id = req.params.id;
  const result = await Godata.findById(id);
  res.status(200).json(result);
};

const make_apply = async (req, res, next) => {
  const { dimigoid, dimigopw, dest, detail, date, time, fill } = req.body;
  dimigo_token = await dimigoin_token(dimigoid, dimigopw);
  user_profile = await dimigoin_jwt(dimigo_token);
  const { name, grade } = user_profile;
  const go_data = await Godata.create({
    name,
    grade,
    dest,
    detail,
    date: date + "T" + time + "Z",
    fill,
    join: [{ name, grade }],
  });
  res.status(200).json({ message: "Success!" });
};

const make_join = async (req, res, next) => {
  const godata_id = req.params.id;
  const { dimigoid, dimigopw } = req.body;
  const dimigo_token = await dimigoin_token(dimigoid, dimigopw);
  const user_profile = await dimigoin_jwt(dimigo_token);
  const { name, grade } = user_profile;
  const godata = await Godata.findById(godata_id);
  const date_list = await Godata.find({ date: godata.date });

  for (let index = 0; index < date_list.length; index++) {
    if (date_list[index].join.indexOf({ name, grade }) != -1)
      return res.status(401).json({ message: "already Exists" }).end();
  }

  if (Number(godata.now) + 1 > Number(godata.fill))
    return res.status(400).json({ message: "so many friends.." });
  godata.join.push({ name, grade });
  const update = await Godata.findByIdAndUpdate(godata_id, {
    $set: { now: Number(godata.now) + 1, join: godata.join },
  });

  res.json(update);
};

module.exports = { list, detail, make_apply, make_join };
