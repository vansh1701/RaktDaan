const mongoose = require("mongoose");

const request = new mongoose.Schema({
    quantity : {
        type:Number,
        require:true
    },
    pname : {
        type:String,
        require:true
    },
    age : {
        type:Number,
        require:true
    },
    bloodgroup : {
        type:String,
        require:true
    },
    phone : {
        type:Number,
        require:true
    },
    hname : {
        type:String,
        require:true
    },
    state : {
        type:String,
        require:true
    },
    pincode : {
        type:Number,
        require:true
    },
    address : {
        type:String,
        require:true
    },
})

const req = new mongoose.model("Request", request);

module.exports = req;