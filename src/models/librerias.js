const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.set('useCreateIndex', true);

const librariesSchema = new Schema({
    idLibrary: {
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
    country: {
        type: String,
        required: true, 
        trim: true
    },
    location: {
        type:String,
        required: true
    },
    telephone: {
        type:String,
        required: true
    },
    schedule: {
        type:String,
        required: true
    }
});

module.exports = librariesSchema;