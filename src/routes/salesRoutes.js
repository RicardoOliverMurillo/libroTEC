const Sale = require('../controllers/salesController');

module.exports = (router) => {
    router.get('/sales', Sale.getSales);
    router.post('/addSale', Sale.createSale);
    router.get('/deleteSale/:id', Sale.deleteSale);
    router.get('/editSale/:id', Sale.findSale);
    router.post('/editSale/:id', Sale.updateSale)
}