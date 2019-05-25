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
    router.get('/review', Users.review);
    router.post('/reviewUpdate/:id', Users.updateReview);
    router.get('/reporteDetails/:id', Users.reporteDetails);
    router.post('/registerClient', Users.createUser);
    router.post('/login', Users.loginUser);
    router.post('/updateInfo/:id', Users.updateUserInfo);
    router.get('/translate/:id', Users.translateBookDescription);
    //Rutas para vistas de Agente
    router.get('/agentHome', Users.agentHome);
    router.get('/agentDeliveryDetails/:id', Users.agentDeliveryDetails);
    router.get('/agentDeliveryDetails/agentBookDetails/:id', Users.agentBookDetails);
    router.get('/agentProcessView/:id', Users.agentProcessView);
    router.post('/agentProcessDelivery/:id', Users.agentProcessDelivery);
    router.get('/agentClientsReport', Users.agentClientsReport);
    router.get('/agentSearchClients',Users.agentSearchClients);
    router.get('/agentDeliveriesReport',Users.agentDeliveriesReport);
    router.get('/agentSearchDeliveriesReport',Users.agentSearchDeliveriesReport);
    //Rutas para vistas de Admin
    router.get('/adminPage', Users.adminPage);
    router.get('/userPage', Users.userPage);

    //rutas para vistas de administradores
    router.get('/AdminHome', Users.adminPage);
    router.get('/books', Users.getBooks);
    router.get('/libraries', Users.getLibraries);
    router.get('/sales', Users.getSales);
    router.get('/booksByTopic', Users.getBooksBytopic);
    router.get('/rangeByClientView', Users.getRangeByClientView);
    router.get('/rangeByClient', Users.getRangeByClient);
    router.get('/topFiveBooks', Users.topFiveBooks);
    router.get('/deliveriesInfo', Users.getReportQuantityView);
    router.get('/deliveriesSearch', Users.quantityBooks);
    router.get('/sentimentAnalysis', Users.getReportSentimentAnalysis);
}