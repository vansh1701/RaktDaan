const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const hospital_signup = new mongoose.Schema({
    hname : {
        type:String,
        require:true
    },
    aname : {
        type:String
    },
    hemail : {
        type:String,
        unique:true,
        require:true
    },
    hphone : {
        type:Number,
        unique:true,
        require:true
    },
    aphone : {
        type:Number,
        require:true
    },
    haddress : {
        type:String
    },
    state : {
        type:String,
        require:true
    },
    pincode : {
        type:String,
        require:true
    },
    location : {
        type:String,
        require:true
    },
    password : {
        type:String,
        require:true
    },
    confirm_password : {
        type:String,
        require:true
    },
    Ap : {
        type:Number,
        require:true
    },
    An : {
        type:Number,
        require:true
    },
    Bp : {
        type:Number,
        require:true
    },
    Bn : {
        type:Number,
        require:true
    },
    Op : {
        type:Number,
        require:true
    },
    On : {
        type:Number,
        require:true
    },
    ABp :{
        type:Number,
        require:true
    },
    ABn :{
        type:Number,
        require:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})

hospital_signup.methods.generateAuthToken = async function(){
    try{
        const token = jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token:token})
        await this.save(); 
        return token;
    }catch (error){
        res.send("the error part" + error);
        console.log("the error part" + error);
    }
}


hospital_signup.pre("save", async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10);
        this.confirm_password = await bcrypt.hash(this.password, 10);
    }
    next();
})
const Signuph = new mongoose.model("Hospital", hospital_signup);

module.exports = Signuph;