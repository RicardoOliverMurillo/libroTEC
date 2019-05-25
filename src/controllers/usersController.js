//variables generales
const Users = require('../models/users');
const Books = require('../models/books');
const Deliveries = require('../models/deliveries');
const Library = require('../models/libraries');
const Sale = require('../models/sales');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SECRET_KEY = 'secretkey123456';
//variables globales
var userGlobal = "";
var idBookGlobal = "";
var pedido = [];
var nameGlobal ="";
var userIdLibrary = "";

//Controlador para abrir la vista de administrador
exports.adminPage = (req, res) =>{
    res.render('AdminViews/mainView')
}
//Controlador para abrir la vista de usuario
exports.userPage = (req, res) =>{
    res.render('userViews/userView')
}
//Controlador para abrir la vista de log in
exports.loginPage = (req, res) =>{
    res.render('index')
}
//Controlador para abrir la vista de registrar usuario
exports.registerPage = (req, res) =>{
    res.render('UserViews/registerView')
}
//Controlador para crear un usuario nuevo
exports.createUser = async (req, res) => {
    const newUser = {
        idUser : req.body.idUser,
        name : req.body.name,
        last_name : req.body.last_name,
        birth : req.body.birth,
        type : req.body.type,
        place : req.body.place,
        email : req.body.email,
        phone_number : req.body.phone_number,
        password : bcrypt.hashSync(req.body.password)
    }
    const user = new Users(newUser);
    await user.save((err, user) =>{  
        if(err && err.code === 11000) return res.status(409).send('Email already exists');
        if (err) return res.status(500).send(err);
        expiresIn = 24 * 60 * 60;
        const accessToken = jwt.sign({ id: user.id}, SECRET_KEY, {
            expiresIn: expiresIn
        });
        const dataUser = {
            name: user.name,
            email: user.email,
            accessToken: accessToken,
            expiresIn: expiresIn
        }
        res.render('index', {dataUser});
    })
}
//Controlador para validad el usuario y contrase;a del usuario
exports.loginUser = async(req, res) =>{
    const userData = {
        email : req.body.email,
        password : req.body.password
    }
    Users.findOne({email: userData.email}, (err, user)=>{
        if (err) return res.status(500).send('Server error');
        if (!user) {
            //email doesn't exist
            res.status(409).send({message: 'something is wrong'});
        } else{
            Books.find({idLibrary:user.idLibrary}, function(err, books) {
                if (err) throw err;
            const resultPassword = bcrypt.compareSync(userData.password, user.password);
            if(resultPassword){
                const expiresIn = 20 * 60 * 60;
                const accessToken = jwt.sign({id: user.id}, SECRET_KEY, {expiresIn: expiresIn});
                
                const dataUser = {
                    name: user.name,
                    email: user.email,
                    idLibrary: user.idLibrary,
                    accessToken: accessToken,
                    expiresIn: expiresIn
                }
                //Redireccionamiento a ClientViewa
                if(user.role === 'client'){
                    userGlobal = dataUser.email;
                    res.render('UserViews/userView', {dataUser,books})  
                //Redireccionamiento a AgentViews
                } else if (user.role === 'agent'){
                    userIdLibrary = dataUser.idLibrary;
                    userGlobal = dataUser.email;
                    nameGlobal = dataUser.name;
                    res.redirect("/agentHome")
                //Redireccionamiento a AdminViews
                }else if (user.role === 'manager'){
                    userIdLibrary = dataUser.idLibrary;
                    nameGlobal = "manager";
                    res.render('AdminViews/mainView')
                } else {
                    userGlobal = dataUser.email;
                    nameGlobal = "admin";
                    res.render('AdminViews/mainView', {nameGlobal, dataUser})
                }
                
            }else{
                //password wrong
                res.status(409).send({message: 'something is wrong'});
            }
            })
        }
    })
}
//Controlador para encontrar un usuario
exports.findUser = async (req, res) =>{
    const user = await Users.findOne({email: req.body.email}, (err, user) =>{
        if (err){
            console.log(err)
        } else{
            res.send({user});
        }
    })
}
//Controlador para actualizar la informacion de un usuario
exports.updateUserInfo = async (req, res) =>{
    const newUser = {
        idUser : req.body.idUser,
        name : req.body.name,
        last_name : req.body.last_name,
        birth : req.body.birth,
        type : req.body.type,
        place : req.body.place,
        email : req.body.email,
        phone_number : req.body.phone_number,
    }
    const { id } = req.params;
    if(req.body.password == ""){
        await Users.update({_id : id}, {idUser:newUser.idUser,name:newUser.name,type:newUser.type,place:newUser.place,email:newUser.email, phone_number:newUser.phone_number}, (err)=>{
            if(err) console.log(err);
            res.redirect('/home')
        })
    }else{
        const dataUser1 = await Users.find({email : userGlobal});
        const dataUser = dataUser1[0];
        const resultPassword = bcrypt.compareSync(req.body.password, dataUser.password);
            if(resultPassword){
                const password = bcrypt.hashSync(req.body.passwordNew)
                await Users.update({_id : id}, {idUser:newUser.idUser,name:newUser.name,type:newUser.type,place:newUser.place,email:newUser.email, phone_number:newUser.phone_number, password:password}, (err)=>{
                    if(err) console.log(err);
                    res.redirect('/home')
                })
            }
    }
    
}
//Controlador para mostrar la vista de actualizar usuario
exports.updateView = async (req, res) =>{
    const dataUser1 = await Users.find({email : userGlobal});
    const dataUser = dataUser1[0];
    res.render('UserViews/userInfo', {dataUser})
}
//Controlador para volver a la pagina de inicio de usuario
exports.home = async (req, res) =>{
    const dataUser1 = await Users.find({email : userGlobal});
    const dataUser = dataUser1[0];
    const books = await Books.find();
    res.render('UserViews/userView', {dataUser, books})
}
//Controlador para eliminar un usuario
exports.deleteUser = async (req,res) =>{
    const {id} = req.params;
    await Users.remove({_id:id});
    res.redirect("/");
}
//Controlador para filtrar la tabla de libros
exports.searchBooks = async(req,res) =>{
    const dataUser1 = await Users.find({email : userGlobal});
    const dataUser = dataUser1[0];

    const library = req.query.library;
    const name = req.query.name;
    const topic = req.query.topic;
    const price1 = req.query.price1;
    const price2 = req.query.price2;
    Books.find({$or: [{name:name},{idLibrary:library},{topic:topic},{price:{$gt : price2, $lt:price1}}]}, function(err, books) {
        if (err) throw err;
        res.render('UserViews/userView', {dataUser, books});
    });  
}
//Controlador para filtrar la tabla de reporte cliente
exports.searchReport = async(req,res) =>{
    const dataUser1 = await Users.find({email : userGlobal});
    const dataUser = dataUser1[0];

    const date1 = req.query.date1;
    const date2 = req.query.date2;
    const state = req.query.state;
    
    const deliveriesClient = await Deliveries.find({$or: [{state:state}, {order_date:{$gte : date1, $lte:date2}}]});
    res.render('UserViews/reportView', {dataUser, deliveriesClient});

}
//Controlador para visualizar la informacion de un libro
exports.infoBooks = async(req,res)=>{
    const dataUser1 = await Users.find({email : userGlobal});
    const dataUser = dataUser1[0];

    const {id} = req.params;
    const book = await Books.findById(id);
    idBookGlobal = book.idBook;
    res.render("UserViews/infoBook", {dataUser,book});
}
//Controlador para agregar un libro a un pedido
exports.addBookDelivery = (req,res)=>{
    pedido.push(idBookGlobal);
    console.log(pedido);
    res.redirect("/home")
}
//Controlador para mostrar los detalles de un pedido
exports.viewDelivery = async(req,res)=>{
    const dataUser1 = await Users.find({email : userGlobal});
    const dataUser = dataUser1[0];

    const books = [];
    for(var i = 0; i < pedido.length; i++){
        const book = await Books.find({idBook:pedido[i]});
        books.push(book);
    }
    res.render("UserViews/deliveryInfo",{dataUser,books});
}
//Controlador para realizar un pedido
exports.addDelivery = async(req,res)=>{
    const dataUser = await Users.find({email : userGlobal});
    const idUser = dataUser[0].idUser;
    var total = 0;

    for(var i = 0; i < pedido.length; i++){
        const book = await Books.find({idBook:pedido[i]});
        console.log(book);
        total = total + book[0].price;
    }
    var fechaPedido= new Date(); 
    
    const deliveryNew = {
        idUser:idUser,
        order_date:fechaPedido,
        books:pedido,
        total:total
    }

    const delivery = new Deliveries(deliveryNew);
    await delivery.save();
    pedido = [];
    res.redirect("/home");
}
//Controlador para obtener todos los pedidos de un cliente en especifico
exports.getDeliveriesClient = async(req,res)=>{
    const dataUser1 = await Users.find({email : userGlobal});
    const dataUser = dataUser1[0];
    const deliveriesClient = await Deliveries.find({idUser:dataUser.idUser});
    res.render("UserViews/myDeliveries",{deliveriesClient, dataUser});
}
//Controlador para ver los detalles del pedido de un cliente en especifico
exports.clientDeliveryDetails = async (req,res)=>{
    const dataUser1 = await Users.find({email : userGlobal});
    const dataUser = dataUser1[0];
    const {id} = req.params;
    const clientDelivery= await Deliveries.findById(id);
    const clientDeliveryBooks = [];
    for(var i = 0; i < clientDelivery.books.length; i++){
        const book = await Books.find({idBook : clientDelivery.books[i]});
        clientDeliveryBooks[i] = book[0];
    };
    res.render("UserViews/deliveryDetail", {dataUser,clientDelivery,clientDeliveryBooks});
}
//Controlador para eliminar un pedido
exports.deleteDelivery = async(req,res)=>{
    const {id} = req.params;
    await Deliveries.remove({_id: id});
    res.redirect("/getDeliveriesClient");
}
//Controlador para mostrar la vista de reporte
exports.reporte = async(req,res)=>{
    const dataUser1 = await Users.find({email : userGlobal});
    const dataUser = dataUser1[0];
    const deliveriesClient = await Deliveries.find({idUser:dataUser.idUser});

    res.render("UserViews/reportView", {dataUser,deliveriesClient});
}
//Controlador para ver los detalles de un pedido procesado
exports.reporteDetails = async(req,res)=>{
    const dataUser1 = await Users.find({email : userGlobal});
    const dataUser = dataUser1[0];
    const {id} = req.params;
    const reportDetails= await Deliveries.findById(id);

    res.render("UserViews/reportDetails", {dataUser,reportDetails});
}

//AGENT FUNTIONS
exports.agentHome = async(req, res) =>{
    const agentDeliveries = await Deliveries.find({idLibrary : userIdLibrary}).sort( { order_date: 1} );
    res.render('AgentViews/deliveriesListView', {nameGlobal,agentDeliveries});
}

exports.agentDeliveryDetails = async(req,res)=>{
    const dataUser1 = await Users.find({email : userGlobal});
    const dataUser = dataUser1[0];
    const {id} = req.params;
    const agentDelivery= await Deliveries.findById(id);
    const agentDeliveryBooks = [];
    for(var i = 0; i < agentDelivery.books.length; i++){
        const book = await Books.find({idBook : agentDelivery.books[i]});
        agentDeliveryBooks[i] = book[0];
    };
    const agentDeliveryClient = await Users.findOne({idUser : agentDelivery.idUser});
    agentDeliveryGlobal = id;
    res.render("AgentViews/deliveryDetail", {dataUser,agentDeliveryClient,nameGlobal,agentDelivery,agentDeliveryBooks});
}

exports.agentBookDetails = async(req,res)=>{
    const dataUser1 = await Users.find({email : userGlobal});
    const dataUser = dataUser1[0];
    const {id} = req.params;
    const agentBook = await Books.findById(id);
    agentBookGlobal = id;
    res.render("AgentViews/bookDetail", {dataUser,nameGlobal,agentBook});
}

exports.agentProcessView = async (req, res) =>{
    const {id} = req.params;
    const agentDelivery = await Deliveries.findById(id);
    res.render('AgentViews/processDelivery', {agentDelivery,nameGlobal});
}

exports.agentProcessDelivery = async(req,res)=>{
    const newDelivery = {
        delivery_location : req.body.delivery_location,
        delivery_date : req.body.delivery_date,
    };

    const {id} = req.params;
    const agentDelivery= await Deliveries.findById(id)
    const idUser = agentDelivery.idUser;
    const agentUser = await Users.findOne({idUser:idUser});
    const place = agentUser.place;
    const email = agentUser.email;

    for(var i = 0; i < agentDelivery.books.length; i++){
        const book = await Books.findOne({idBook : agentDelivery.books[i]});
        const idBookLong = book._id;
        const qSoldCopy = book.qSold;
        const qAvailableCopy = book.qAvailable;
        const qSold = qSoldCopy + 1;
        const qAvailable = qAvailableCopy - 1;
        await Books.updateOne({_id : idBookLong}, {$set:{qSold:qSold, qAvailable:qAvailable}})
    };

    await Deliveries.updateOne({_id : id}, {$set:{delivery_location:newDelivery.delivery_location, delivery_date:newDelivery.delivery_date,state:"Procesado"}})
    var nodemailer = require('nodemailer');
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: false,
        port: 25,
        auth:{
            user: 'tectrabajos2019@gmail.com',
            pass: 'ati123456'
        },
        tls:{
            rejectUnathorized: false
        }
    });
    let HelperOptions = {
        from: '"LibroTEC" <tectrabajos2019@gmail.com>',
        to: email,
        subject: 'Pedido LibroTEC',
        text: 'Su pedido pronto estará a llegando a '+ place + '. Detalle de entrega: Fecha de entrega[' 
        + newDelivery.delivery_location + '], Lugar de entrega[' +newDelivery.delivery_date+']',
    };
    transporter.sendMail(HelperOptions, (error, info) => {
        if(error){
            console.log(error);
        }
        console.log("Correo enviado");
        console.log(info);
    });

    res.redirect('/agentHome')
}

exports.agentClientsReport = async (req, res) =>{
    const agentUsers = await Users.find({$and:[{idLibrary:userIdLibrary},{role:"client"}]});
    res.render('AgentViews/clientsReport', {nameGlobal, agentUsers});
}

exports.agentSearchClients = async(req,res) =>{
    const idUser = req.query.idUser;
    const name = req.query.name;
    const last_name = req.query.last_name;
    const birth = req.query.birth;
    const type = req.query.type;
    const place = req.query.place;
    const phone_number = req.query.phone_number;
    const email = req.query.email;

    Users.find({$and:[{$or: [{idUser:idUser},{name:name},{last_name:last_name},{birth:birth},{type:type},
        {place:place},{phone_number:phone_number},{email:email}]},{idLibrary:userIdLibrary},{role:"client"}]}, 
        function(err, agentUsers) {
        if (err) throw err;
        res.render('AgentViews/clientsReport', {nameGlobal, agentUsers});
    });  
}

exports.agentDeliveriesReport = async(req,res)=>{
    const agentDeliveries = await Deliveries.find({idLibrary:userIdLibrary});
    res.render("AgentViews/deliveriesReport", {nameGlobal,agentDeliveries});
}

exports.agentSearchDeliveriesReport = async(req,res) =>{
    const idUser = req.query.idUser;
    const date1 = req.query.date1;
    const date2 = req.query.date2;
    const topic = req.query.topic;
    const state = req.query.state;

    const agentDeliveries = await Deliveries.find({$and:[{$or: [{state:state},{idUser:idUser},{order_date:{$gte : date1, $lte:date2}}]},{idLibrary:userIdLibrary}]});
    res.render("AgentViews/deliveriesReport", {nameGlobal,agentDeliveries});

}

//Admin Functions
//Controlador para filtrar la vista de libros en la vista administrador
exports.getBooks = async (req, res) => {
    if(nameGlobal=="manager"){
        const books = await Books.find({idLibrary:userIdLibrary});
        res.render("AdminViews/booksView", {books});
    }else{
        const books = await Books.find();
        res.render("AdminViews/booksView", {books});
    }
    
}
//Controlador para filtrar la vista de librerias en la vista administrador
exports.getLibraries = async (req, res) => {
    if(nameGlobal=="manager"){
        const library = await Library.find({idLibrary:userIdLibrary});
        res.render("AdminViews/librariesView", {library});
    }else{
        const library = await Library.find({});
        res.render("AdminViews/librariesView", {library});
    }
}
//Controlador para filtrar la vista de promociones en la vista administrador
exports.getSales = async (req, res) => {
    if(nameGlobal=="manager"){
        const sales = await Sale.find({idLibrary:userIdLibrary});
        res.render('AdminViews/salesView', {sales});
    }else{
        const sales = await Sale.find();
        res.render('AdminViews/salesView', {sales});
    }
}

//CONSULTAS
//Controlador para mostrar la consulta libros pedidos por temas
exports.getBooksBytopic = async (req, res) => {
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
    var deliveries = new Deliveries ();
    if(nameGlobal=="manager"){
        deliveries = await Deliveries.find({idLibrary:userIdLibrary});
    }else{
        deliveries = await Deliveries.find();
    }
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
                    break;
                case "Literatura":
                    literatureArray.push(bookFound[0]);
                    literatureTotalPrice += bookFound[0].price;
                    break;
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
//Controlador para mostrar los 5 libros mas vendidos
exports.topFiveBooks = async (req, res) => {
    const result = [];
    var resultSearch = new Deliveries();
    if(nameGlobal=="manager"){
        resultSearch = await Deliveries.aggregate([
            {$match: 
                { idLibrary : userIdLibrary }
            },
            { $unwind : "$books" },
            { $group: { _id: "$books" , count: { $sum: 1 } } },
            { $sort : { count : -1 } },
            { $limit : 5 }
        ]);
    }else{
        resultSearch = await Deliveries.aggregate([
            { $unwind : "$books" },
            { $group: { _id: "$books" , count: { $sum: 1 } } },
            { $sort : { count : -1 } },
            { $limit : 5 }
        ]);
    }
    
    for (var i = 0; i<resultSearch.length; i++){
        const bookName = await Books.find({idBook: resultSearch[i]._id});
        //verificar que el idLibreria de libro sea igual al idLibreria de manager
        result.push([bookName[0].name, resultSearch[i].count]);
    }
    res.render('AdminViews/reportTopFiveBooksView', {result});

}
//Controlador para mostrar la vista reportByClients
exports.getRangeByClientView = async (req, res) => {
    const rangeInfo=[];
    res.render('AdminViews/reportByClients', {rangeInfo});
}
//Controlador para mostrar rango de pedidos por cliente
exports.getRangeByClient = async (req, res) => {
    const rangeInfo=[];
    const clientInfo = await Users.find({idUser:req.query.busqueda});
    if(nameGlobal =="manager"){
        if( clientInfo[0].idLibrary == userIdLibrary){
            const delivery = await Deliveries.find({idUser: req.query.busqueda})
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
        }
    }else{
        const delivery = await Deliveries.find({idUser: req.query.busqueda})
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
    }
    rangeInfo.push([clientInfo[0].name, minRange, maxRange])
    res.render('AdminViews/reportByClients', {rangeInfo});
}
//Controlador para mostrar la cantidad de libros solicitados por cliente
exports.quantityBooks = async (req, res) => {
    var result = new Deliveries();
    if(nameGlobal=="manager"){
        result = await Deliveries.aggregate([
            {$match: {
                $or: [
                    { $and: [ {idUser : req.query.name},
                        {idLibrary : userIdLibrary} ] },                  
                    {topic: req.query.topic},
                    {state: req.query.state},
                    {date: {$gt : req.query.init_date, $lt : req.query.finish_date}}
                ]
            }},
            { $group : { _id: "$idUser", count: { $sum: 1 } } }
        ]);
    }else if (nameGlobal=="admin"){
        result = await Deliveries.aggregate([
            {$match: {
                $or: [
                    {idUser: req.query.name},
                    {topic: req.query.topic},
                    {state: req.query.state},
                    {date: {$gt : req.query.init_date, $lt : req.query.finish_date}}
                ]
            }},
            { $group : { _id: "$idUser", count: { $sum: 1 } } }
        ]);
    }
    res.render('AdminViews/reportQuantityInfo', {result});
}
//Controlador para mostrar la vista de reportQuantityInfo
exports.getReportQuantityView = async (req, res) => {
    const result=[];
    res.render('AdminViews/reportQuantityInfo', {result});
}

exports.getReportSentimentAnalysis = async (req, res) => {
    //var comments = ["Yo amo los gatos son super tiernos","odio los gatos son pateticos","los gatos son tiernos pero me dan asco","soy alergico a los gatos",
    //"no tolero a los gatos","los gatos son los mejores amigos del hombre","no me gustan los gatos","me encantan muchisimo","odio los gatos"]
    const users = await Users.find();
    console.log(users);
    var positiveComments = 0;
    var negativeComments = 0;
    var negativeResult = 0;
    var positiveResult = 0;
    var result =[];
    var Sentiment = require('sentiment');
    var sentiment = new Sentiment();
    for (var i = 0; i<comments.length; i++){
        /*var result = sentiment.analyze(commentTranslated);
                if (result.comparative < 0){
                    console.log("entré")
                    negativeComments = negativeComments + 1;
                    negativeResult = negativeResult + result.comparative;
                    
                } else {
                    positiveComments = positiveComments + 1;
                    positiveResult = positiveResult + result.comparative;
                }
        console.log(negativeComments);
        console.log(negativeResult);
        console.log("---------------------------------------");
        console.log(positiveComments);
        console.log(positiveResult);
        console.log("---------------------------------------");
        console.log(negativeResult / negativeComments);
        console.log(positiveResult / positiveComments)*/
    }

    res.render("AdminViews/reportSentimentAnalysis",{result});
}