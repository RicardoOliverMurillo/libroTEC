const Users = require('../models/users');
const Books = require('../models/books');
const Deliveries = require('../models/deliveries');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SECRET_KEY = 'secretkey123456';
var moment = require('moment');

var userGlobal = "";
var idBookGlobal = "";
var pedido = [];
//Variable global para partial de AgentViews
var nameGlobal ="";

exports.adminPage = (req, res) =>{
    res.render('AdminViews/mainView')
}

exports.userPage = (req, res) =>{
    res.render('userViews/userView')
}

exports.loginPage = (req, res) =>{
    res.render('index')
}

exports.registerPage = (req, res) =>{
    res.render('UserViews/registerView')
}

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
        
        //response 
        res.render('index', {dataUser});
    })
}

exports.loginUser = async(req, res) =>{
    const userData = {
        email : req.body.email,
        password : req.body.password
    }
    const books = await Books.find();
    const agentDeliveries = await Deliveries.find();
    Users.findOne({email: userData.email}, (err, user)=>{
        if (err) return res.status(500).send('Server error');
        if (!user) {
            //email doesn't exist
            res.status(409).send({message: 'something is wrong'});
        } else{
            const resultPassword = bcrypt.compareSync(userData.password, user.password);
            if(resultPassword){
                const expiresIn = 20 * 60 * 60;
                const accessToken = jwt.sign({id: user.id}, SECRET_KEY, {expiresIn: expiresIn});
                
                const dataUser = {
                    name: user.name,
                    email: user.email,
                    accessToken: accessToken,
                    expiresIn: expiresIn
                }
                if(user.role === 'client'){
                    userGlobal = dataUser.email;
                    res.render('UserViews/userView', {dataUser,books})  
                //Redireccionamiento a AgentViews
                } else if (user.role === 'agent'){
                    userGlobal = dataUser.email;
                    nameGlobal = dataUser.name;
                    res.render('AgentViews/deliveriesListView', {nameGlobal, dataUser,agentDeliveries})
                }
                else {
                    userGlobal = dataUser.email;
                    nameGlobal = dataUser.name;
                    res.render('AdminViews/mainView', {nameGlobal, dataUser})
                }
                
            }else{
                //password wrong
                res.status(409).send({message: 'something is wrong'});
            }
        }
    })
}

exports.findUser = async (req, res) =>{
    const user = await Users.findOne({email: req.body.email}, (err, user) =>{
        if (err){
            console.log(err)
        } else{
            res.send({user});
        }
    })
}

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

exports.updateView = async (req, res) =>{
    const dataUser1 = await Users.find({email : userGlobal});
    const dataUser = dataUser1[0];
    res.render('UserViews/userInfo', {dataUser})
}

exports.home = async (req, res) =>{
    const dataUser1 = await Users.find({email : userGlobal});
    const dataUser = dataUser1[0];
    const books = await Books.find();
    res.render('UserViews/userView', {dataUser, books})
}

exports.deleteUser = async (req,res) =>{
    const {id} = req.params;
    await Users.remove({_id:id});
    res.redirect("/");
}

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

exports.searchReport = async(req,res) =>{
    const dataUser1 = await Users.find({email : userGlobal});
    const dataUser = dataUser1[0];

    const date1 = req.query.date1;
    const date2 = req.query.date2;
    const state = req.query.state;

    const deliveriesClient = await Deliveries.find({$or: [{state:state}, {order_date:{$gte : date1, $lte:date2}}]});
    res.render('UserViews/reportView', {dataUser, deliveriesClient});

}

exports.infoBooks = async(req,res)=>{
    const dataUser1 = await Users.find({email : userGlobal});
    const dataUser = dataUser1[0];

    const {id} = req.params;
    const book = await Books.findById(id);
    idBookGlobal = book.idBook;
    res.render("UserViews/infoBook", {dataUser,book});
}

exports.addBookDelivery = (req,res)=>{
    pedido.push(idBookGlobal);
    console.log(pedido);
    res.redirect("/home")
}

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

exports.getDeliveriesClient = async(req,res)=>{
    const dataUser1 = await Users.find({email : userGlobal});
    const dataUser = dataUser1[0];
    const deliveriesClient = await Deliveries.find({idUser:dataUser.idUser});
    res.render("UserViews/myDeliveries",{deliveriesClient, dataUser});
}

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

exports.deleteDelivery = async(req,res)=>{
    const {id} = req.params;
    await Deliveries.remove({_id: id});
    res.redirect("/getDeliveriesClient");
}

exports.reporte = async(req,res)=>{
    const dataUser1 = await Users.find({email : userGlobal});
    const dataUser = dataUser1[0];
    const deliveriesClient = await Deliveries.find({idUser:dataUser.idUser});

    res.render("UserViews/reportView", {dataUser,deliveriesClient});
}

exports.reporteDetails = async(req,res)=>{
    const dataUser1 = await Users.find({email : userGlobal});
    const dataUser = dataUser1[0];
    const {id} = req.params;
    const reportDetails= await Deliveries.findById(id);

    res.render("UserViews/reportDetails", {dataUser,reportDetails});
}

//AGENT FUNTIONS
exports.agentHome = async(req, res) =>{
    const agentDeliveries = await Deliveries.find();
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
    agentDeliveryGlobal = id;
    res.render("AgentViews/deliveryDetail", {dataUser,nameGlobal,agentDelivery,agentDeliveryBooks});
}

exports.agentBookDetails = async(req,res)=>{
    const dataUser1 = await Users.find({email : userGlobal});
    const dataUser = dataUser1[0];
    const {id} = req.params;
    const agentBook = await Books.findById(id);
    agentBookGlobal = id;
    res.render("AgentViews/bookDetail", {dataUser,nameGlobal,agentBook});
}

//Admin Functions
