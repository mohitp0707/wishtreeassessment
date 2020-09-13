var express = require('express');
var userhandler= require('../controllers/usercontrollers.js');
var app = module.exports= express.Router();


app.post("/register",userhandler.registeruser);
app.post("/login",userhandler.login);

