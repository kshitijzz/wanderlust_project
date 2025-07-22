const { required } = require("joi");
const mongoose = require("mongoose");
const Schema= mongoose.Schema;
const passportlocalmongoose= require('passport-local-mongoose');



const userSchema= new Schema  ({
  
    email:{
        type:String,
        required:true,
    },
    //username and password will be automatically defined
    //by the passport-local-mogoose
});

userSchema.plugin(passportlocalmongoose);

module.exports= mongoose.model("User",userSchema);