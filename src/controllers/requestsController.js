const Books = require('../models/books');
const Deliveries = require('../models/deliveries');
const Users = require('../models/users');

exports.getBooksBytopic = async (req, res) => {
    const deliveries = await Deliveries.find();
    const enginneringArray = [];
    var enginneringTotalPrice = 0;
    const adminArray = [];
    var adminTotalPrice = 0;
    const naturalScienceArray = [];
    var naturalScienceTotalPrice = 0;
    const artsArray = [];
    var artsTotalPrice = 0;
    const historyArray = [];
    var historyTotalPrice = 0;
    const mathArray = [];
    var mathTotalPrice = 0;
    const fictionArray = [];
    var fictionTotalPrice = 0;
    const literatureArray = [];
    var literatureTotalPrice = 0;
    const result = [];
    for (var i = 0; i<deliveries.length; i++){
        const booksDelivery = deliveries[i].books;
        for(var j = 0; j<booksDelivery.length; j++){
            var bookFound = await Books.find({idBook: booksDelivery[j]})
            switch (bookFound[0].topic) {
                case "Ingeniería":
                    enginneringArray.push(bookFound[0]);
                    enginneringTotalPrice += bookFound[0].price;
                    break;
                case "Administración":
                    adminArray.push(bookFound[0]);
                    adminTotalPrice += bookFound[0].price;
                  break;
                case "Ciencias Naturales":
                    naturalScienceArray.push(bookFound[0]);
                    naturalScienceTotalPrice += bookFound[0].price;
                  break;
                case "Artes":
                    artsArray.push(bookFound[0]);
                    artsTotalPrice += bookFound[0].price;
                  break;
                case "Historia":
                    historyArray.push(bookFound[0]);
                    historyTotalPrice += bookFound[0].price;
                  break;
                case "Matemáticas":
                    mathArray.push(bookFound[0]);
                    mathTotalPrice += bookFound[0].price;
                  break;
                case "Ficción":
                    fictionArray.push(bookFound[0]);
                    fictionTotalPrice += bookFound[0].price;
                case "Literatura":
                    literatureArray.push(bookFound[0]);
                    literatureTotalPrice += bookFound[0].price;
              }
        }
    }
    result.push(["Ingeniería",enginneringArray.length, enginneringTotalPrice/enginneringArray.length])
    result.push(["Administración",adminArray.length, adminTotalPrice/adminArray.length])
    result.push(["Ciencias Naturales",naturalScienceArray.length, naturalScienceTotalPrice/naturalScienceArray.length])
    result.push(["Artes",artsArray.length, artsTotalPrice/artsArray.length])
    result.push(["Historia",historyArray.length, historyTotalPrice/historyArray.length])
    result.push(["Matemáticas",mathArray.length, mathTotalPrice/mathArray.length])
    result.push(["Ficción",fictionArray.length, fictionTotalPrice/fictionArray.length])
    result.push(["Literatura",literatureArray.length, literatureTotalPrice/literatureArray.length])
    res.render('AdminViews/reportsByTopic',{result});
}

exports.getRangeByClientView = async (req, res) => {
    const rangeInfo=[];
    res.render('AdminViews/reportByClients', {rangeInfo});
}

exports.getRangeByClient = async (req, res) => {
    const rangeInfo=[];
    const clientInfo = await Users.find({$or: [{email:req.query.busqueda}]});
    const delivery = await Deliveries.find({idUser: clientInfo[0].idUser})
    var rangeBooks = delivery[0].books
    var minRange = rangeBooks.length;
    var maxRange = rangeBooks.length;
    for (var i = 1; i<delivery.length; i++){
        rangeBooks = delivery[i].books;
        if (minRange > rangeBooks.length){
            minRange = rangeBooks.length;
        } else if(maxRange < rangeBooks.length){
            maxRange = rangeBooks.length;
        }
    }
    rangeInfo.push([clientInfo[0].name, minRange, maxRange])
    res.render('AdminViews/reportByClients', {rangeInfo});
}

exports.topFiveBooks = async (req, res) => {
    const result = [];
    const resultSearch = await Deliveries.aggregate([
        { $unwind : "$books" },
        { $group: { _id: "$books" , count: { $sum: 1 } } },
        { $sort : { count : -1 } },
        { $limit : 5 }
    ]);
    for (var i = 0; i<resultSearch.length; i++){
        const bookName = await Books.find({idBook: resultSearch[i]._id});
        result.push([bookName[0].name, resultSearch[i].count]);
    }
    res.render('AdminViews/reportTopFiveBooksView', {result});
}

exports.quantityBooks = async (req, res) => {
    const result = await Deliveries.aggregate([
        //{$unwind: "$books"},
        {$match: {
            $or: [
                {idUser: req.query.busqueda},
                {topic: req.query.busqueda},
                {state: req.query.busqueda}
            ]
        }},
        { $group : { _id: "$idUser", count: { $sum: 1 } } }
    ]);
    res.render('AdminViews/reportQuantityInfo', {result});
}

exports.getReportQuantityView = async (req, res) => {
    const result=[];
    res.render('AdminViews/reportQuantityInfo', {result});
}