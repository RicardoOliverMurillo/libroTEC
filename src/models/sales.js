const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.set('useCreateIndex', true);

const salesSchema = new Schema({
    idSale: {
        type: String,
        required: true, 
        trim: true,
        unique: true
    },
    description: {
        type: String,
        required: true, 
        trim: true
    },
    init_date: {
        type: String,
        required: true, 
        trim: true
    },
    finish_date: {
        type:String,
        required: true
    },
    per_disccount: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("Sales", salesSchema);