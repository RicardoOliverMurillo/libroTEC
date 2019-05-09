const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.set('useCreateIndex', true);

const deliveriesSchema = new Schema({
    idDelivery: {
        type: String,
        required: true, 
        trim: true
    },
    idClient: {
        type: String,
        required: true, 
        trim: true
    },
    delivery_date: {
        type: String,
        required: true, 
        trim: true
    },
    books: {
        type: [String],
        required: true, 
        trim: true
    },
    total: {
        type: Number,
        required: true, 
        trim: true
    },
    delivery_location: {
        type:String,
        required: true
    },
    state: {
        type:String,
        required: true
    }
});

module.exports = deliveriesSchema;