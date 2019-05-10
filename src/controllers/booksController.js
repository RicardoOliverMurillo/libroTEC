const Books = require('../models/books');

exports.createBook = async (req, res) => {
    const book = new Books(req.body);
    await book.save((err, book)=>{
        if(err) console.log(err);
        res.send({book})
    })
}

exports.getBooks = async (req, res) => {
    const books = await Books.find();
    res.send({books});
}

exports.deleteBook = async (req, res) => {
    const { id } = req.params;
    await Books.deleteOne({_id : id }, (err)=>{
        if(err){
            console.log(err);
        } else{
            res.send("deleted");
        }
    });
}

exports.findBook = async (req,res)=>{
    const {id} = req.params;
    await Books.findById({_id : id}, (err, book)=>{
        if (err){
            console.log(err);
        } else{
            res.send({book});
        }
    });
}

exports.updateBook = async (req, res) => {
    const { id } = req.params;
    await Books.update({_id : id}, req.body, (err, book)=>{
        if(err) console.log(err);
        res.send('updated')
    })
}