const Users = require('../dao/authDao');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SECRET_KEY = 'secretkey123456';

exports.loginPage = (req, res) =>{
    res.render('index')
}

exports.createUser = (req, res, next) => {
    const newUser = {
        name : req.body.name,
        email : req.body.email,
        password : bcrypt.hashSync(req.body.password),
        role : req.body.role
    }
    Users.create(newUser, (err, user) => {
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
        res.send ({dataUser});
    });
}

exports.loginUser = (req, res, next) =>{
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
                    res.render('UserViews/userView')  
                } else {
                    res.render('AdminViews/mainView')
                }
                
            }else{
                //password wrong
                res.status(409).send({message: 'something is wrong'});
            }
        }
    })
}