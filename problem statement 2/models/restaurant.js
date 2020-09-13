const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require('validator');
var registerModel = mongoose.model("restaurents", {
    name: {type:String, required:true, trim:true},
    area: {type:String , required:true },
    city: {type:String , required:true},
    address: {type:String , required:true },
    pincode: {type:String , required:true },
	email:{type:String, required:true, unique: true, lowercase: true,
        validate: value => {
            if (!validator.isEmail(value)) {
                throw new Error(JSON.stringify({error: 'Invalid Email address'}))
            }
        }},
	contact:{type:String, required:true, trim:true},
    password:{type:String, required:true, trim:true},
    dateofregister: {type: Date, default: Date.now},
    isactive:{type:Boolean,default:true}
});

module.exports = registerModel;