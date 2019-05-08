const Users = require('../controllers/authController');

module.exports = (router) => {
    router.post('/register', Users.createUser);
    router.post('/login', Users.loginUser);
}