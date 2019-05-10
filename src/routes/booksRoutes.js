const Books = require('../controllers/booksController');

module.exports = (router) => {
    router.get('/books', Books.getBooks);
    router.post('/addBooks', Books.createBook);
    router.get('/deleteBook/:id', Books.deleteBook);
    router.get('/editBook/:id', Books.findBook);
    router.post('/editBook/:id', Books.updateBook)
}