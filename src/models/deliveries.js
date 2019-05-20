const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.set('useCreateIndex', true);

const deliveriesSchema = new Schema({
    idDelivery: {
        type: String,
        required: false, 
        trim: true
    },
    idUser: {
        type: String,
        required: true, 
        trim: true
    },
    order_date: {
        type: Date,
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
    state: {
        type:String,
        required: true,
        default : 'En proceso'
    },
    delivery_location: {
        type:String,
        required: false,
        default: "Sin ubicación asignada"
    },
    delivery_date: {
        type: String,
        required: false, 
        trim: true,
        default: "Sin fecha de entrega asignada"
    },
    idLibrary: {
        type:String,
        required: false
    }
});

module.exports = mongoose.model("Deliveries", deliveriesSchema);