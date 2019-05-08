const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const properties = require('./config/props');
const DB = require('./config/db');
const bodyParser = require('body-parser');

//init DB
DB();

//bodyparser
const bodyParserJSON = bodyParser.json();
const bodyParserURLEncoded = bodyParser.urlencoded({extended: true});

const app = express();
const router = express.Router();

app.use(cors());
app.use(bodyParserJSON);
app.use(bodyParserURLEncoded); 
app.use('/api', router)
authRoutes(router)
router.get('/', (req, res)=> {
    res.send('hello from home'); 
});
app.use(router);


app.listen(properties.PORT, ()=> console.log("Server on port ${properties.PORT}"));