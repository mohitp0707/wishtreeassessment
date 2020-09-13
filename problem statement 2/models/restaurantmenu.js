const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require('validator');
var registerModel = mongoose.model("restaurentsmenus", {
    restaurant_id: {type:Schema.ObjectId, required:true},
    name: {type:String , required:true },
    price:{type:Number,require:true},
    integradents: {type:String , required:true},
    rating: {type:Number  },
    feedback: [],
    dateofregister: {type: Date, default: Date.now},
    isactive:{type:Boolean,default:true}
});

module.exports = registerModel;