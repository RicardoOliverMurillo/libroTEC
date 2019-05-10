const Users = require('../models/users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SECRET_KEY = 'secretkey123456';

exports.loginPage = (req, res) =>{
    res.render('index')
}

exports.registerPage = (req, res) =>{
    res.render('UserViews/registerView')
}

exports.createUser = async (req, res) => {
    const newUser = {
        idClient : req.body.idClient,
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

exports.loginUser = (req, res) =>{
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
                    res.render('UserViews/userView', {dataUser})  
                } else {
                    res.render('AdminViews/mainView', {dataUser})
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
        idClient : req.body.idClient,
        name : req.body.name,
        last_name : req.body.last_name,
        birth : req.body.birth,
        type : req.body.type,
        place : req.body.place,
        email : req.body.email,
        phone_number : req.body.phone_number,
        password : bcrypt.hashSync(req.body.password)
    }
    const { id } = req.params;
    await Users.update({_id : id}, newUser, (err)=>{
        if(err) console.log(err);
        res.send('updated')
    })
}
