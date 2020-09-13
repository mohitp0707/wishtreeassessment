const mongoose = require("mongoose");
const validator = require('validator');
const Bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require('./../config.js');
const registerModel=require('./../models/user');


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
        response.json({status:"200",message: "User Added Successfully!!!"});
        // response.status(200).send("user added successfully");
    } catch (error) {
        if(error.name === 'MongoError' && error.code === 11000){
            response.status(403).send({ message: "User Already Exist!!!" });
        }else{
            console.log(error);
            // response.status(500).send(error);
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
            // }else if(data.islogin==true){
            //     return response.status(401).send({ message: "Already Logged inn!!!" })
            // }
            else{
              //  data.IsLogin=true;
                data=data.toObject();
                delete data.password;
                // await registerModel.updateOne({_id :data._id },{islogin: true})
                const token = jwt.sign({id: data._id},   config.secretKey, { expiresIn: '3h' });
                await registerModel.updateOne({email :request.body.email },{fcmToken: request.body.fcmToken});
                response.json({status:"200", message: "Login Successfully!!!",data, token:token});
            }
        } catch (error) {
            console.log(error);
            // response.status(403).send(error);
            response.status(403).send({message:error.message});
        }
    }
};