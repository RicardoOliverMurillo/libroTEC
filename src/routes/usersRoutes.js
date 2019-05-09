const Users = require('../controllers/usersController');

module.exports = (router) => {
    router.get('/', Users.loginPage);
    router.get('/register', Users.registerPage);
    router.post('/registerClient', Users.createUser);
    router.post('/login', Users.loginUser);
}