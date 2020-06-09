const express = require('express');
const router = express.Router();
const Book = require('../models').Book;


/* Handler function to wrap each route.*/
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      // res.status(500).send(error);
      next(error)
    }
  }
}

// let createError = require("http-errors");

//  Shows the full list of books.
router.get('/', asyncHandler(async (req, res) => {
  const books = await Book.findAll({ order: [["year", "DESC"]]});
  res.render('books', { books, title: "Books"}); 
}));

// Shows the create new book form.
router.get('/new', asyncHandler(async(req, res) => {
  res.render('books/new', { book: {}, title: "New Book"})
  console.log('books/new') 
}));

// Posts a new book to the database.
router.post('/new', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    // console.log(req.body);
    res.redirect("/books/" + book.id); 
  } catch (error) {
    if(error.name === "SequelizeValidationError") {
     book = await Book.build(req.body);
     res.render("books/new", { book, errors: error.errors, title: "New Book" }) 
    } else {
      throw error;
    }
  }
}));

// Edit book form.
router.get("/:id/edit",asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    res.render("books/edit", {book, title: "Edit Book"});
  } else {
    res.sendStatus(404);
  }
}));

// Shows book detail form.
router.get("/:id", asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    res.render("books/book_detail", { book, title: book.title}) 
  } else {
    res.sendStatus(404);
  }
}));

// Updates book info in the database.
router.post("/:id/edit", asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    await book.update(req.body);
    res.redirect("/books/edit/" + book.id); 
  } else {
    res.sendStatus(404);
  }
}));

/* Deletes book form. */ 
router.get('/:id/delete', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    res.render("books/delete", { book: {}, title: "Delete Book"}) 
  } else {
    res.sendStatus(404);
  }
}));

// Delete a book.
router.post('/:id/delete', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    await book.destroy();
    res.redirect("/books");
  } else {
    res.sendStatus(404);
  } 
}));

module.exports = router;
