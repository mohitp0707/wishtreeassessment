var express = require('express');
var restaurenthandler= require('../controllers/restaurentscontroller.js');
var app = module.exports= express.Router();


app.post("/register",restaurenthandler.registeruser);  // register restaurents
app.post("/login",restaurenthandler.login); // login restuarents
app.post("/addmenu",restaurenthandler.addmenu);  // add menu
app.get('/menulist',restaurenthandler.getmenu); // get menu by all restaurents
app.get('/menulist/:id',restaurenthandler.getmenubyid); // get menu by particular restaurents
app.post("/order",restaurenthandler.order);
app.get("/orderdetails/:id",restaurenthandler.orderdetails);