const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const donor_signup = new mongoose.Schema({
    dname : {
        type:String
    },
    demail : {
        type:String,
        unique:true,
        require:true
    },
    dphone : {
        type:Number,
        unique:true,
        require:true
    },
    bloodgroup : {
        type:String,
        require:true        
    },
    DOB : {
        type:Date,
        require:true
    },
    address : {
        type:String
    },
    state : {
        type:String,
        require:true
    },
    pincode : {
        type:String
    },
    allergy : {
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
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
}) 

donor_signup.methods.generateAuthToken = async function(){
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

donor_signup.pre("save", async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10);
        this.confirm_password = await bcrypt.hash(this.password, 10);
    }
    next();
})
const Signupd = new mongoose.model("Register", donor_signup);
module.exports = Signupd;