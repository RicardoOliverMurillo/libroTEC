const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.set('useCreateIndex', true);

const booksSchema = new Schema({
    idBook: {
        type: String,
        required: true, 
        trim: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    topic: {
        type: String,
        required: true, 
        trim: true
    },
    description: {
        type:String,
        required: true
    },
    qSold: {
        type:Number,
        default: 0
    },
    qAvailable: {
        type:Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    idLibrary:{
        type:String,
        default: 1
    }
});

module.exports = mongoose.model("Books", booksSchema);