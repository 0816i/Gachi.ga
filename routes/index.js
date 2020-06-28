var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/list', (req, res, next) => {
  res.render('list', { title: '게시판' })
});

module.exports = router;
