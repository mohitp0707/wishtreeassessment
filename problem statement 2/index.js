var express = require('express');
const mongoose = require("mongoose");
var app = express();
const BodyParser = require("body-parser");
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
const dbConfig = require('./config.js');

app.use(function (req, res, next) {  
    res.setHeader("Access-Control-Allow-Origin", "*");  
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");  
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With,contentType,Content-Type, Accept, Authorization,x-access-token");  
	 res.setHeader('Access-Control-Allow-Credentials', true);

    next();  
});  

var users = require('./routing/users');
var restaurents = require('./routing/restaurents');

app.use('/users',users);
app.use('/restaurants',restaurents);

// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

app.listen(5000,function(){
    console.log('Server is running..');
    
});