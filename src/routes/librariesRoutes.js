const Library = require('../controllers/librariesController');

module.exports = (router) => {
    router.get('/libraries', Library.getLibraries);
    router.post('/addLibrary', Library.createLibrary);
    router.get('/deleteLibrary/:id', Library.deleteLibrary);
    router.get('/editLibrary/:id', Library.findLibrary);
    router.post('/editLibrary/:id', Library.updateLibrary)
}