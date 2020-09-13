const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require('validator');
var registerModel = mongoose.model("order", {
    order_restaurant_id: {type:Schema.ObjectId, required:true},
    order_restaurant_menu_id: {type:Schema.ObjectId, required:true},
    order_user_id: {type:Schema.ObjectId, required:true},
    order_date: {type:Date, required:true},
    order_status:{type:Number,required:true},
    order_delivery_area:{type:String , required:true },
    order_delivery_city:{type:String , required:true }

});

module.exports = registerModel;