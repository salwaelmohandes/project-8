const express = require('express');
const router = express.Router();
const Book = require('../models').Book;
const { Op } = require('../models').Sequelize;

const booksPerPage = 5;

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

router.get('/page/:page', asyncHandler(async(req, res) => {
  const books = await Book.findAll({order: [["title", "ASC"]] });
  let pages = books.length/booksPerPage
  const first = (parseInt(req.params.page) * booksPerPage) - booksPerPage
  const end = first + 6;
    if(first + 1>books.length){
      res.render('books/page-not-found')
    }else {
  const pageBooks = books.slice(first+1, end);
  res.render('books', {books: pageBooks, pages})
  }
}))

//  Shows the list of books.
router.get('/', asyncHandler(async (req, res) => {
  // const books = await Book.findAll({ order: [["year", "DESC"]]});
  res.redirect('/books/page/1'); 
}));


router.get('/search', asyncHandler(async(req, res) => {
  res.render('books/search', {books, query: req.body.search});
}));


router.post('/search', asyncHandler( async(req,res) => {
  search = true;
  const books = await Book.findAll({
    where: {
      [Op.or]: 
        {title: {[Op.like]: `%${req.body.query}%`},
        author: {[Op.like]: `%${req.body.query}%`},
        genre: {[Op.like]: `%${req.body.query}%`},
        year: {[Op.like]: `%${req.body.query}%`}
      }
    },
  });
  res.render('books/search', {books, query: req.body.search});
}));



// Shows the create new book form.
router.get('/new', asyncHandler(async(req, res) => {
  res.render('books/new', { book: {}, title: "New Book"})
}));

// Posts a new book to the database.
router.post('/', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
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
    // res.sendStatus(404);
    throw error;
    }
}));

// Shows book detail form.
router.get("/:id", asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    res.render("books/book_detail", { book, title: book.title}) 
  } else {    
    // res.sendStatus(404);
    throw error;
  }
}));

// Updates book info in the database.
router.post("/:id/edit", asyncHandler(async (req, res) => {
  let book;
  try {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    await book.update(req.body);
    res.redirect("/books/" + book.id); 
  } else {
    // res.sendStatus(404);
    throw error;
  }
} catch (error) {
  if(error.name === "SequelizeValidationError") {
   book = await Book.build(req.body);
   res.render("books/edit", { book, errors: error.errors, title: "Edit Book" }) 
  } else {
    throw error;   
    }
  }  
}));

/* Deletes book form. */ 
router.get('/:id/delete', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    res.render("books/delete", { book: {}, title: "Delete Book"}) 
  } else {
    // res.sendStatus(404);
    throw error;
  }
}));

// Delete a book.
router.post('/:id/delete', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    await book.destroy();
    res.redirect("/books");
  } else {
    // res.sendStatus(404);
    throw error;  
  } 
}));

module.exports = router;
