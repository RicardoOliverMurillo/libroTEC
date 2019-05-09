const path = require('path');
const express = require('express');
const cors = require('cors');
const properties = require('./config/props');
const DB = require('./config/db');
const bodyParser = require('body-parser');

//Importing routes
const authRoutes = require('./routes/authRoutes');

//init DB
DB();

//bodyparser
const bodyParserJSON = bodyParser.json();
const bodyParserURLEncoded = bodyParser.urlencoded({extended: true});

const app = express();
const router = express.Router();

app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');

app.use(cors());
app.use(bodyParserJSON);
app.use(bodyParserURLEncoded); 
app.use('/api', router)
authRoutes(router)
router.get('/', authRoutes);
app.use(router);


app.listen(properties.PORT, ()=> console.log("Server on port ${properties.PORT}"));