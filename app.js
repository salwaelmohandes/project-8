const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const booksRouter = require('./routes/books');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/books', booksRouter);

// catch error and forward to error handler
app.use(function(req, res, next) {
  // const err = new Error('Oh noes!')
  // err.status = 500;
  next(createError(404));
  // next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  if (err.status=== 404) {
    res.render('error');
  }else {
  // // render the error page
    res.status(err.status || 500 );
    // const err = new Error('Oh noes!')
    // res.status(err.status);
    res.render('books/page-not-found');
  }
});

module.exports = app;
