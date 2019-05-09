const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.set('useCreateIndex', true);

const booksSchema = new Schema({
    idBook: {
        type: String,
        required: true, 
        trim: true
    },
    name: {
        type: String,
        required: true, 
        trim: true,
        unique: true
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
        type:String,
        required: true
    },
    qAvailable: {
        type:String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});

module.exports = booksSchema;