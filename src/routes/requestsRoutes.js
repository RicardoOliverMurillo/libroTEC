const requests = require('../controllers/requestsController');

module.exports = (router) =>{
    router.get('/booksByTopic', requests.getBooksBytopic);
    router.get('/rangeByClientView', requests.getRangeByClientView);
    router.get('/rangeByClient', requests.getRangeByClient);
    router.get('/topFiveBooks', requests.topFiveBooks);
    router.get('/deliveriesInfo', requests.getReportQuantityView);
    router.get('/deliveriesSearch', requests.quantityBooks);
}