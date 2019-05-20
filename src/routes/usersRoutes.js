const Users = require('../controllers/usersController');

module.exports = (router) => {
    router.get('/', Users.loginPage);
    router.get('/home', Users.home);
    router.get('/register', Users.registerPage);
    router.get('/users',Users.findUser);
    router.get('/updateView', Users.updateView);
    router.get('/deleteUser/:id', Users.deleteUser);
    router.get('/searchBooks',Users.searchBooks);
    router.get('/searchReport',Users.searchReport);
    router.get('/infoBooks/:id',Users.infoBooks);
    router.get('/addBookDelivery',Users.addBookDelivery);
    router.get('/viewDelivery',Users.viewDelivery);
    router.get('/addDelivery', Users.addDelivery);
    router.get('/getDeliveriesClient', Users.getDeliveriesClient);
    router.get('/clientDeliveryDetails/:id', Users.clientDeliveryDetails);
    router.get('/deleteDelivery/:id', Users.deleteDelivery);
    router.get('/reporte', Users.reporte);
    router.get('/reporteDetails/:id', Users.reporteDetails);
    router.post('/registerClient', Users.createUser);
    router.post('/login', Users.loginUser);
    router.post('/updateInfo/:id', Users.updateUserInfo);
    //Rutas para vistas de Agente
    router.get('/agentHome', Users.agentHome);
    router.get('/agentDeliveryDetails/:id', Users.agentDeliveryDetails);
    router.get('/agentDeliveryDetails/agentBookDetails/:id', Users.agentBookDetails);
    router.get('/adminPage', Users.adminPage);
    router.get('/userPage', Users.userPage);
}