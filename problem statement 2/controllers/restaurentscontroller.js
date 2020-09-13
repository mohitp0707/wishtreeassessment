const mongoose = require("mongoose");
const validator = require('validator');
const Bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require('./../config.js');
const registerModel=require('./../models/restaurant');
const restaurantmenu=require('./../models/restaurantmenu');
const orderModel=require('./../models/order');
var ObjectId = require('mongoose').Types.ObjectId;

exports.orderdetails= async function (request, response) {
    if (!request.params.id) {
        return response.status(403).send({
            message: "id not present"
        });
    } else {
            var token = request.headers['x-access-token'];
            if (!token) return response.status(401).send({ auth: false, message: 'No token provided.' });
            jwt.verify(token, config.secretKey,async function (err, decoded) {
                if  (err) { return response.status(401).send({ auth: false, message: 'Failed to authenticate token.' }); }
                else{
                    try {
                        let condition = { "order_status" : 1 , "order_restaurant_id" : ObjectId(request.params.id)};
                        orderModel.aggregate([
                            { $match : condition},
                          
                           {
                            $lookup:{
                                from: "users", 
                                localField: "order_user_id", 
                                foreignField: "_id",
                                as: "userInfo"
                            }
                        },
                        { "$unwind": "$userInfo"  },
                        { $lookup:{
                                from: "restaurentsmenus",
                                localField: "order_restaurant_menu_id",
                                foreignField: "_id",
                                as: "menudetail"
                            }
                        },
                        { "$unwind": "$menudetails"  },
                        { "$project": {
                            "order_date": 1,
                            "order_status":1,
                            "order_delivery_area":1,
                            "order_delivery_city":1,
                             "menu_name":"$menudetails.name",
                            "Person": {$concat:["$userInfo.firstname"," ","$userInfo.lastname"]},
                            "contact":"$userInfo.contact",
                            "status":{
                                $cond: { if: 'order_status == 1' , then: "Active" , else: "Cancel" }
                            }
                          }}
                           ], function(err, data) {
                                  console.log(err);
                               //   console.log(data);
                                 response.json({status:"200",data});
                       });
                    } catch (error) {
                        console.log(error);
                        // response.status(500).send(error);
                        response.status(403).send({message:error.message});
                    }
                }
            }) 
    }
};


exports.order= async function (request, response) {
    if (!request.body) {
        return response.status(401).send({
            message: "Note content can not be empty"
        });
    } else {
            var token = request.headers['x-access-token'];
            if (!token) return response.status(401).send({ auth: false, message: 'No token provided.' });
            jwt.verify(token, config.secretKey,async function (err, decoded) {
                if  (err) { return response.status(401).send({ auth: false, message: 'Failed to authenticate token.' }); }
                else{
                    try {
                        const order = new orderModel(request.body);
                        await order.save();
                        response.json({status:"200", message: "order placed successfully!!!"});
                    } catch (error) {
                        console.log(error);
                        // response.status(500).send(error);
                        response.status(403).send({message:error.message});
                    }
                }
            }) 
    }
};

exports.getmenubyid= async function (request, response) {
    if (!request.params.id) {
        return response.status(403).send({
            message: "id not present"
        });
    } else {
            var token = request.headers['x-access-token'];
            if (!token) return response.status(401).send({ auth: false, message: 'No token provided.' });
            jwt.verify(token, config.secretKey,async function (err, decoded) {
                if  (err) { return response.status(401).send({ auth: false, message: 'Failed to authenticate token.' }); }
                else{
                    try {
                        let condition = { "isactive" : true , "restaurant_id" : ObjectId(request.params.id)};
                        restaurantmenu.aggregate([
                            { $match : condition},
                           { $lookup:
                           {
                               from: 'restaurents',
                               localField: 'restaurant_id',
                               foreignField: '_id',
                               as: 'restaurent'
                           }
                           },
                           { "$unwind": "$restaurent"  },
                           { "$project": {
                            "name": 1,
                            "price": 1,
                            "menu_id": "$_id",
                            "integradents":1,
                            "area": {$concat:["$restaurent.area","-","$restaurent.city"]} ,
                            "address":"$restaurent.address",
                            "name":"$restaurent.name"
                          }}
                           ], function(err, data) {
                                 // console.log(err);
                                //  console.log(data);
                                 response.json({status:"200",data});
                       });
                    } catch (error) {
                        console.log(error);
                        // response.status(500).send(error);
                        response.status(403).send({message:error.message});
                    }
                }
            }) 
    }
};

exports.getmenu= async function (request, response) {
    if (!request.body) {
        return response.status(401).send({
            message: "Note content can not be empty"
        });
    } else {
            var token = request.headers['x-access-token'];
            if (!token) return response.status(401).send({ auth: false, message: 'No token provided.' });
            jwt.verify(token, config.secretKey,async function (err, decoded) {
                if  (err) { return response.status(401).send({ auth: false, message: 'Failed to authenticate token.' }); }
                else{
                    try {
                        let condition = { "isactive" : true };
                        restaurantmenu.aggregate([
                            { $match : condition},
                           { $lookup:
                           {
                               from: 'restaurents',
                               localField: 'restaurant_id',
                               foreignField: '_id',
                               as: 'restaurent'
                           }
                           },
                           { "$unwind": "$restaurent"  },
                           { "$project": {
                            "name": 1,
                            "price": 1,
                            "menu_id": "_id",
                            "integradents":1,
                            "area": {$concat:["$restaurent.area","-","$restaurent.city"]} ,
                            "address":"$restaurent.address",
                            "name":"$restaurent.name"
                          }}
                           ], function(err, data) {
                                 // console.log(err);
                                //  console.log(data);
                                 response.json({status:"200",data});
                       });
                    } catch (error) {
                        console.log(error);
                        // response.status(500).send(error);
                        response.status(403).send({message:error.message});
                    }
                }
            }) 
    }
};

exports.addmenu= async function (request, response) {
    if (!request.body) {
        return response.status(401).send({
            message: "Note content can not be empty"
        });
    } else {
            var token = request.headers['x-access-token'];
            if (!token) return response.status(401).send({ auth: false, message: 'No token provided.' });
            jwt.verify(token, config.secretKey,async function (err, decoded) {
                if  (err) { return response.status(401).send({ auth: false, message: 'Failed to authenticate token.' }); }
                else{
                    try {
                        const menu = new restaurantmenu(request.body);
                        await menu.save();
                        response.json({status:"200", message: "Added Successfully!!!"});
                    } catch (error) {
                        console.log(error);
                        // response.status(500).send(error);
                        response.status(403).send({message:error.message});
                    }
                }
            }) 
    }
};

exports.registeruser= async function (request, response) {
    if(!request.body) {
        return response.status(403).send({
            message: "Note content can not be empty"
        });
    }else{ try {
        request.body.password = Bcrypt.hashSync(request.body.password, 10);
        var register = new registerModel(request.body);
        var data={};
        data = await register.save();
        const token = jwt.sign({id: data._id},   config.secretKey, { expiresIn: '3h' });
        data=data.toObject();
        delete data.password;
        response.json({status:"200",message: "restaurents Added Successfully!!!"});
    } catch (error) {
        if(error.name === 'MongoError' && error.code === 11000){
            response.status(403).send({ message: "restaurents Already Exist!!!" });
        }else{
            console.log(error);
            response.status(403).send({message:error.message});
        }
    }
    }
};

exports.login= async function (request, response) {
    if(!request.body) {
        return response.status(403).send({
            message: "Note content can not be empty"
        });
    }else{ 
        try {
            var data = await registerModel.findOne({ email: request.body.email }).exec();
            if(!data) {
                return response.status(403).send({ message: "Email Not Available" });
            }else if(!Bcrypt.compareSync(request.body.password, data.password)) {
                return response.status(403).send({ message: "Password Is Invalid" });
            }else if(data.isactive==false){
                return response.status(403).send({ message: "User not activated!!!" })
            }
            else{
                data=data.toObject();
                delete data.password;
                const token = jwt.sign({id: data._id},   config.secretKey, { expiresIn: '3h' });
                await registerModel.updateOne({email :request.body.email },{fcmToken: request.body.fcmToken});
                response.json({status:"200", message: "Login Successfully!!!",data, token:token});
            }
        } catch (error) {
            console.log(error);
            response.status(403).send({message:error.message});
        }
    }
};