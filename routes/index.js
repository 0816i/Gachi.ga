var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Godata = require("../models/godata");
const request = require("request");
const { token } = require('morgan');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '메인페이지' });
});

router.get('/list', (req, res, next) => {
  Godata.find({}, (err, result) => {
    res.render("list", {result});
  })
});

router.get('/apply', (req, res, next) => {
  res.render('apply', { title: '등록' })
});

router.post('/apply',(req, ress, next) => {
  const { dimigoid, dimigopw, dest, detail, date, time, fill } = req.body;
  const options = {
    uri: "https://api.dimigo.in/auth",
    method: 'POST',
    body: {
      'id': dimigoid,
      'password': dimigopw
    },
    json: true
  };
  request.post(options, (err, api_res, body) => {
    const token = api_res.body.token;
    const options_jwt = {
      uri: "https://api.dimigo.in/user/jwt",
      method: 'GET',
      headers: {
        "Authorization": 'Bearer ' + token,
      },
      json: true
    };
    if (api_res.statusCode === 200) {
      request.get(options_jwt, (err, apii_res, body) => {
        const { name, grade } = apii_res.body;
        Godata.create({ name, grade, dest, detail, 'date':date+'T'+time+'Z', fill, 'joiner':[name]}, (err, result) => {
          if (err) return ress.status(500).send({ 'message': err })
          else return ress.status(200).send(result);
        })
      });
    }
    else {
      ress.status(400).json({ 'message': 'something wrong' });
    }
  });
});

module.exports = router;
