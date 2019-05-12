const Users = require('../controllers/usersController');

module.exports = (router) => {
    router.get('/', Users.loginPage);
    router.get('/home', Users.home);
    router.get('/register', Users.registerPage);
    router.get('/users',Users.findUser);
    router.get('/updateView', Users.updateView);
    router.get('/deleteUser/:id', Users.deleteUser);
    router.get('/searchBooks',Users.searchBooks);
    router.get('/infoBooks/:id',Users.infoBooks);
    router.post('/registerClient', Users.createUser);
    router.post('/login', Users.loginUser);
    router.post('/updateInfo/:id', Users.updateUserInfo);
}