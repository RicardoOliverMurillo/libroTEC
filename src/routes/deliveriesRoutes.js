const Deliveries = require('../controllers/deliveriesController');

module.exports = (router) => {
    router.get('/deliveries', Deliveries.getDeliveries);
    router.post('/addDeliveries', Deliveries.createDelivery);
    router.get('/deleteDelivery/:id', Deliveries.deleteDelivery);
    router.get('/editDelivery/:id', Deliveries.findDelivery);
    router.post('/editDelivery/:id', Deliveries.updateDelivery)
}