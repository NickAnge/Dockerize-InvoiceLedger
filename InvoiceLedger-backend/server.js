const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const db = require('./database/config');
//const Sequelize = require('sequelize');


const router = require('./router')
const app = express();


//Test db CHANGE TO BE SEEn
db.authenticate().then(()=>console.log("Database connected")).catch((error) => console.log(error))
//For BodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//initialize passport

 app.use(passport.initialize());
//Cors allow
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", 'PUT,POST,PATCH,DELETE,GET,OPTIONS');
    res.header(
        "Access-Control-Allow-Headers",
        "Origin,X-Requested-With,Content-Type,Accept,Authorization"
    );
    if (req.method === 'OPTIONS')
        return res.sendStatus(200);
    else {
        if (req.method == 'POST' || req.method == 'PUT')
            console.log(req.body);

        console.log(`${req.method}\t${req.originalUrl}`);
        next();
    }
});

app.get('/', function (req, res) {
    
    res.send('Welcome to Delivery Ledger');
});
//PORT Number
const PORT = process.env.PORT || 5000;

app.listen(PORT, function (err) {
    if (!err)
        console.log("Site is live");
    else console.log(err)

});

//routes to be served
router(app);
//Εrror Method For wrong routes/pages doesnt exist
app.use((req, res, next) => {
    const error = new Error("Page not Found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    console.log("Problem")
    console.log(error)
    res.json({
        error: {
            message: error.message
        }
    });
});

// module.exports = server;
