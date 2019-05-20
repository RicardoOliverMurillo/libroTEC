const requests = require('../controllers/requestsController');

module.exports = (router) =>{
    router.get('/booksByTopic', requests.getBooksBytopic);
    router.get('/rangeByClientView', requests.getRangeByClientView);
    router.get('/rangeByClient', requests.getRangeByClient);
}