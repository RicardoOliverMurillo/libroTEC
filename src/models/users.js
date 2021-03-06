const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.set('useCreateIndex', true);

const userSchema = new Schema({
    idUser: {
        type: Number,
        required: true, 
        trim: true
    },
    name: {
        type: String,
        required: true, 
        trim: true
    },
    last_name: {
        type: String,
        required: true, 
        trim: true
    },
    birth: {
        type: String,
        required: true, 
        trim: true
    },
    type: {
        type: String,
        required: true, 
        trim: true
    },
    place: {
        type: String,
        required: true, 
        trim: true
    },
    email: {
        type: String,
        required: true, 
        trim: true,
        unique: true
    },
    phone_number: {
        type: String,
        required: true, 
        trim: true
    },
    password: {
        type: String,
        required: true, 
        trim: true
    },
    role: {
        type:String,
        required: true,
        default: "client"
    },
    review: {
        type:String,
        required: true,
        default: "null"
    },
    idLibrary: {
        type:String,
        default: "1"
    }
    },{
    timestamps: true
});

module.exports = mongoose.model("Users", userSchema);