const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('books/index', { title: 'Books' });
  // res.redirect('/index');
});

module.exports = router;
