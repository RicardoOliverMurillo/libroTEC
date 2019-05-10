const path = require('path');
const express = require('express');
const cors = require('cors');
const properties = require('./config/props');
const DB = require('./config/db');
const bodyParser = require('body-parser');

//Importing routes
const userRoutes = require('./routes/usersRoutes');
const booksRoutes = require('./routes/booksRoutes');
const librariesRoutes = require('./routes/librariesRoutes');
const salesRoutes = require('./routes/salesRoutes');

//init DB
DB();

//bodyparser
const bodyParserJSON = bodyParser.json();
const bodyParserURLEncoded = bodyParser.urlencoded({extended: true});

const app = express();
const router = express.Router();

//Routes
userRoutes(router)
router.get('/', userRoutes);
booksRoutes(router)
router.get('/books', booksRoutes);
librariesRoutes(router)
router.get('/libraries', librariesRoutes);
salesRoutes(router)
router.get('/sales', salesRoutes);


//views engine
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');

app.use(cors());
app.use(bodyParserJSON);
app.use(bodyParserURLEncoded); 
app.use('/api', router)


app.use(router);


app.listen(properties.PORT, ()=> console.log("Server on port ${properties.PORT}"));