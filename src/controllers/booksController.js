const Books = require('../models/books');

exports.createBook = async (req, res) => {
    const book = new Books(req.body);
    await book.save((err, book)=>{
        if(err) console.log(err);
        res.redirect("/books")
    })
}

exports.getBooks = async (req, res) => {
    const books = await Books.find();
    res.render("AdminViews/booksView", {books});
}

exports.deleteBook = async (req, res) => {
    const { id } = req.params;
    await Books.deleteOne({_id : id }, (err)=>{
        if(err){
            console.log(err);
        } else{
            res.redirect("/books");
        }
    });
}

exports.findBook = async (req,res)=>{
    const {id} = req.params;
    await Books.findById({_id : id}, (err, book)=>{
        if (err){
            console.log(err);
        } else{
            res.render("AdminViews/updateBookView", {book});
        }
    });
}

exports.updateBook = async (req, res) => {
    const { id } = req.params;
    await Books.update({_id : id}, req.body, (err, book)=>{
        if(err) console.log(err);
        res.redirect('/books')
    })
}

exports.translateBookDescription = async (req, res) =>  {
    const { id } = req.params;
    await Books.findById({_id : id}, (err, book)=>{
            if (err){
                console.log(err);
            } else{
                var api = "AIzaSyAwBXQazgJFt-fKtqYWcpdnMXgsj4F1ycI";
                var googleTranslate = require('google-translate')(api);
                
                var text = book.description;
                console.log("English :>",text);
                googleTranslate.translate(text, 'en', function(err, translation) {
                console.log("Spanish :>",translation.translatedText);
                res.render("AdminViews/updateBookView", {book});
            });
        }
    });
}
