const Books = require('../models/books');
const Deliveries = require('../models/deliveries');
const Users = require('../models/users');

exports.getBooksBytopic = async (req, res) => {
    const deliveries = await Deliveries.find();
    const topic = req.topic;
    console.log(deliveries);
    for (var i = 0; i < deliveries.length; i++){
        console.log(deliveries[0]);
    }
}