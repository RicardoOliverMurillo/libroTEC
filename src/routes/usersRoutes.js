const Users = require('../controllers/usersController');

module.exports = (router) => {
    router.get('/', Users.loginPage);
    router.get('/register', Users.registerPage);
    router.get('/users',Users.findUser)
    router.post('/registerClient', Users.createUser);
    router.post('/login', Users.loginUser);
    router.post('/updateInfo/:id', Users.updateUserInfo);
    router.get('/adminPage', Users.adminPage);
    router.get('/userPage', Users.userPage);
}