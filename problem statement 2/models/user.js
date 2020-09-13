const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require('validator');
var registerModel = mongoose.model("users", {
    firstname: {type:String, required:true, trim:true},
	lastname: {type:String},
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