const Users = require('../models/users');
const Books = require('../models/books');
const Deliveries = require('../models/deliveries');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SECRET_KEY = 'secretkey123456';

var userGlobal = "";
var idBookGlobal = "";
var pedido = [];
//Variable global para partial de AgentViews
var nameGlobal ="";
var userIdLibrary = "";

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
                    idLibrary: user.idLibrary,
                    accessToken: accessToken,
                    expiresIn: expiresIn
                }
                if(user.role === 'client'){
                    userGlobal = dataUser.email;
                    res.render('UserViews/userView', {dataUser,books})  
                //Redireccionamiento a AgentViews
                } else if (user.role === 'agent'){
                    userIdLibrary = dataUser.idLibrary;
                    console.log(userIdLibrary);
                    userGlobal = dataUser.email;
                    nameGlobal = dataUser.name;
                    res.redirect("/agentHome")
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
    Books.find({$or: [{name:name}, {topic:topic},{price:{$gt: price1, $lt:price2}}]}, function(err, books) {
        if (err) throw err;
        res.render('UserViews/userView', {dataUser, books});
    });  
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

//AGENT FUNTIONS
exports.agentHome = async(req, res) =>{
    const agentDeliveries = await Deliveries.find({idLibrary : userIdLibrary});
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
    console.log("Esta leyendo");
    //const idDelivery = req.body.idDelivery;
    const newDelivery = {
        delivery_location : req.body.delivery_location,
        delivery_date : req.body.delivery_date,
    };
    console.log("newDelivery");
    console.log(newDelivery);
    //const agentDelivery= await Deliveries.findOne({idDelivery:idDelivery});
    console.log("req.params");
    console.log(req.params);
    const {id} = req.params;
    console.log("{id}");
    console.log({id});
    console.log("id");
    console.log(id);
    const agentDelivery= await Deliveries.findById(id)
    console.log("agentDelivery");
    console.log(agentDelivery);
    for(var i = 0; i < agentDelivery.books.length; i++){
        console.log("Start round "+i);
        const book = await Books.findOne({idBook : agentDelivery.books[i]});
        console.log("book");
        console.log(book );
        //agentDeliveryBooks[i] = book[0];
        const idBookLong = book._id;
        console.log("idBookLong");
        console.log(idBookLong);
        const qSoldCopy = book.qSold;
        console.log("qSoldCopy");
        console.log(qSoldCopy);
        const qAvailableCopy = book.qAvailable;
        console.log("qAvailableCopy");
        const qSold = qSoldCopy + 1;
        console.log("new qSold");
        console.log(qSold);
        const qAvailable = qAvailableCopy - 1;
        console.log("new qAvailable");
        console.log(qAvailable);
        await Books.updateOne({_id : idBookLong}, {$set:{qSold:qSold, qAvailable:qAvailable}})/*, (err)=>{
            if(err) console.log(err);
        })*/
        console.log("Finish round "+i);
    };
    console.log("Finish Books update");
    await Deliveries.updateOne({_id : id}, {$set:{delivery_location:newDelivery.delivery_location, delivery_date:newDelivery.delivery_date,state:"Procesado"}})/*, (err)=>{
        if(err) console.log(err);
        res.redirect('/agentHome')
    })*/
    console.log("Finish Dalivery update");
    res.redirect('/agentHome')
}

exports.agentClientsReport = async (req, res) =>{
    const agentUsers = await Users.find({$and:[{idLibrary:userIdLibrary},{role:"client"}]});
    res.render('AgentViews/clientsReport', {nameGlobal, agentUsers});
}

exports.agentSearchClients = async(req,res) =>{
    const idUser = req.query.idUser;
    /*console.log("idUser");
    console.log(idUser);*/
    const name = req.query.name;
    /*console.log("name");
    console.log(name);*/
    const last_name = req.query.last_name;
    //console.log(last_name);
    const birth = req.query.birth;
    //console.log();
    const type = req.query.type;
    //console.log(type);
    const place = req.query.place;
    //console.log(place);
    const phone_number = req.query.phone_number;
    //console.log(phone_number);
    const email = req.query.email;
    //console.log(email);

    Users.find({$and:[{$or: [{idUser:idUser},{name:name},{last_name:last_name},{birth:birth},{type:type},
        {place:place},{phone_number:phone_number},{email:email}]},{idLibrary:userIdLibrary},{role:"client"}]}, 
        function(err, agentUsers) {
        if (err) throw err;
        /*console.log("agentUsers");
        console.log(agentUsers);*/
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
    /*console.log("topic");
    console.log(topic);
    if (topic == ""){
        console.log("funciona");
    };*/
    const state = req.query.state;

    const agentDeliveries = await Deliveries.find({$and:[{$or: [{state:state},{idUser:idUser},{order_date:{$gte : date1, $lte:date2}}]},{idLibrary:userIdLibrary}]});
    res.render("AgentViews/deliveriesReport", {nameGlobal,agentDeliveries});

}

//Admin Functions
