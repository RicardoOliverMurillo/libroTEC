const Users = require('../controllers/authController');

module.exports = (router) => {
    router.get('/', Users.loginPage);
    router.post('/register', Users.createUser);
    router.post('/login', Users.loginUser);
}