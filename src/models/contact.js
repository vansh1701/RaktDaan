const mongoose = require("mongoose");

const contact_us = new mongoose.Schema({
    name : {
        type:String,
        require:true
    },
    email : {
        type:String,
        require:true
    },
    phone : {
        type:Number,
        require:true
    },
    problem : {
        type:String,
        require:true
    },
    state : {
        type:String,
        require:true
    },
})

const contact = new mongoose.model("Contact", contact_us);
module.exports = contact;