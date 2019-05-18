const requests = require('../controllers/requestsController');

module.exports = (router) =>{
    router.get('/booksByTopic', requests.getBooksBytopic);
    
}